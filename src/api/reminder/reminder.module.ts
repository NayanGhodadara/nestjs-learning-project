import { Module } from "node_modules/@nestjs/common";
import { ReminderService } from "./reminder.service";
import { NotificationModule } from "../notification/notification.module";
import { ReminderController } from "./reminder.controller";
import { TypeOrmModule } from "node_modules/@nestjs/typeorm";
import { ReminderEntity } from "./reminder.entity";
import { DeviceTokenModule } from "../notification/device-token/device-token.module";

@Module({
    imports: [
        NotificationModule,
        DeviceTokenModule,
        TypeOrmModule.forFeature([ReminderEntity])
    ],
    providers: [ReminderService],
    controllers: [ReminderController]
})
export class ReminderModule { }