import { NotificationService } from './../notification/notification.service';
import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { TokenService } from '../token/token.service';
import { MessageDto } from './message.dto';
import { ChatService } from '../chat/chat.service';
import { ChatDto } from '../chat/chat.dto';
import { dateToTimestamp, generateUniqueId } from 'src/utils/app.utils';
import moment from 'moment';
import { DeviceTokenService } from '../notification/device-token/device-token.service';

@WebSocketGateway(
    {
        cors: {
            origin: '*',
        },
        path: '/socket'
    }
)
@Injectable()
export class SocketService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly chatService: ChatService,
        private readonly notificationService: NotificationService,
        private readonly deviceTokenService: DeviceTokenService
    ) { }

    @WebSocketServer()
    server!: Server;

    afterInit(server: Server) {
        server.use(async (socket: Socket, next) => {
            const token = socket.handshake.auth?.token
            const result = await this.tokenService.verifyToken(token);

            if (!result) {
                console.log('Rejecting connection (NO_TOKEN)');
                return next(new Error('UN_AUTHORIZED'));
            }
            socket.data.user = result;
            next(); // allow connection
        });
    }

    async handleConnection(client: Socket, ...args: any[]) {
        const user = client.data.user;
        await this.userService.changeOnlineStatus(user.uid, true);
        client.join(user.uid.toString());
        console.log(`connected user ${user.uid}`)
    }

    async handleDisconnect(client: Socket) {
        const user = client.data.user;
        await this.userService.changeOnlineStatus(user.uid, false);
        console.log(`disconnected user ${user.uid}`)
    }

    @SubscribeMessage('send-message')
    async handleMessage(
        @MessageBody()
        data: MessageDto,
        @ConnectedSocket()
        client: Socket
    ) {
        let user = client.data.user;
        const payload = {
            ...data,
            senderUid: user.uid
        }

        // Save chat to database
        const chatDetail: ChatDto = {
            chatId: generateUniqueId("C"),
            createdAt: dateToTimestamp(moment().toDate()) || 0,
            message: payload.message,
            sender: { uid: payload.senderUid.toString() },
            receiver: { uid: payload.receiverUid.toString() }
        }

        await this.createChat(chatDetail)

        this.server.to(payload.receiverUid.toString()).emit('receive-message', {
            ...chatDetail
        })

        this.server.to(payload.senderUid.toString()).emit('receive-message', {
            ...chatDetail
        })
    }

    @SubscribeMessage('typing')
    async handleTyping(
        @MessageBody()
        data: { receiverUid: number, isTyping: boolean },
        @ConnectedSocket()
        client: Socket
    ) {

        let user = client.data.user;
        this.server.to(data.receiverUid.toString()).emit('typing', {
            receiverUid: user.uid,
            isTyping: data.isTyping
        })
    }

    async createChat(chatDto: ChatDto) {
        const tokenData = await this.deviceTokenService.findUserTokenByUid(chatDto.receiver.uid);
        const sendNotificationDto = {
            title: 'New Message',
            body: chatDto.message,
            type: 'chat',
            token: tokenData?.token as string
        }
        await this.notificationService.sendNotification(tokenData?.deviceId as string, sendNotificationDto);
        return this.chatService.createChat(chatDto);
    }
}