import { Injectable } from "node_modules/@nestjs/common";
import { ChatEntity } from "./chat.entity";
import { Repository } from "node_modules/typeorm";
import { InjectRepository } from "node_modules/@nestjs/typeorm";
import { ChatDto } from "./chat.dto";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private readonly chatRepository: Repository<ChatEntity>
    ) { }

    async createChat(chat: ChatDto) {
        const chatData = {
            chatId: chat.chatId,
            createdAt: chat.createdAt,
            message: chat.message,
            sender: { uid: chat.sender.uid } as any,
            receiver: { uid: chat.receiver.uid } as any,
        }
        await this.chatRepository.save(chatData);
    }

    async getAllchat(uid: string, receiverUid: string, count: number = 0, limit = 10) {

        const [data, total] = await this.chatRepository.createQueryBuilder('chat')
            .leftJoinAndSelect('chat.sender', 'sender')
            .leftJoinAndSelect('chat.receiver', 'receiver')
            .where(
                '(sender.uid = :uid AND receiver.uid = :receiverUid)',
                { uid, receiverUid }
            )
            .orWhere('sender.uid = :receiverUid AND receiver.uid = :uid',
                { receiverUid, uid })

            .orderBy('chat.createdAt', 'ASC')
            .skip(count)
            .take(limit)
            .getManyAndCount();

        const chats = data.map((chat) => {
            if (chat.sender) {
                delete (chat.sender as any).password;
            }

            if (chat.receiver) {
                delete (chat.receiver as any).password;
            }

            return chat;
        })

        return { data: chats, total }
    }

}