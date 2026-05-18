import { Module } from "@nestjs/common";
import { SocketController } from "./socket.controller";
import { SocketService } from "./socket.service";
import { UserModules } from "../user/user.module";
import { TokenModule } from "../token/token.module";
import { ChatModule } from "../chat/chat.module";
import { NotificationModule } from "../notification/notification.module";
import { DeviceTokenModule } from "../notification/device-token/device-token.module";

@Module({
    imports: [UserModules,
        TokenModule,
        ChatModule,
        NotificationModule,
        DeviceTokenModule
    ],
    controllers: [SocketController],
    providers: [SocketService]
})
export class SocketModule { }