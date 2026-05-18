import { SendNotificationDto } from './../notification/sendNotificationDto';
import moment from 'moment';
import { DeviceTokenService } from './../notification/device-token/device-token.service';
import { NotificationService } from './../notification/notification.service';
import { Injectable } from "node_modules/@nestjs/common";
import { Cron, CronExpression } from "node_modules/@nestjs/schedule";
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { ReminderEntity } from './reminder.entity';
import { Repository } from 'node_modules/typeorm';
import { dateToTimestamp, generateUniqueId } from 'src/utils/app.utils';
import { ReminderType } from 'src/constants/app.constants';
import { ReminderDto } from './reminder.dto';

@Injectable()
export class ReminderService {
    constructor(
        @InjectRepository(ReminderEntity)
        private repo: Repository<ReminderEntity>,

        private readonly notificationService: NotificationService,
        private readonly deviceTokenService: DeviceTokenService
    ) { }

    async createReminder(uid: string, reminderDto: ReminderDto) {
        const data = this.repo.create({
            rid: generateUniqueId("R"),
            title: reminderDto.title,
            description: reminderDto.description,
            sendAt: reminderDto.sendAt,
            reminderType: reminderDto.reminderType,
            isSent: false,
            user: { uid: uid }
        })
        let savedData = await this.repo.save(data)
        const result = await this.repo.findOne({
            where: { rid: savedData.rid },
            relations: ['user']
        })
        if (result?.user.password) {
            delete (result?.user as any).password
        }
        return result
    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    async runCron() {
        const result = await this.repo
            .createQueryBuilder("reminder")
            .leftJoinAndSelect("reminder.user", "user")
            .where({ isSent: false })
            .getMany()

        if (result) {
            for (const reminder of result) {

                const { canSend, isOneTime } = this.needToSendReminder(reminder.sendAt, reminder.reminderType, reminder.lastSentAt, reminder.isSent)

                if (canSend) {
                    console.log("Time match and try to send notification")

                    //find reminder-user device token
                    const tokenData = await this.deviceTokenService.findUserTokenByUid(reminder.user.uid)

                    //send notification to reminder user
                    const notificationDto: SendNotificationDto = {
                        title: reminder.title,
                        body: reminder.description,
                        type: 'reminder',
                        token: tokenData?.token as any
                    }

                    await this.notificationService.sendNotification(tokenData?.deviceId as any, notificationDto)

                    if (isOneTime) {
                        reminder.isSent = true;
                    }

                    reminder.lastSentAt = dateToTimestamp(moment().toDate()) || 0
                    await this.repo.save(reminder);
                }
            }
        }
    }

    needToSendReminder(sendAt: number, type: ReminderType, lastSentAt: number = 0, isSent: boolean) {
        const now = new Date()
        const sendTime = new Date(Number(sendAt))

        const isSameHour = now.getHours() === sendTime.getHours()
        const isSameMinute = now.getMinutes() === sendTime.getMinutes()

        const isSameWeekDay = now.getDay() === sendTime.getDay()
        const isSameDate = now.getDate() === sendTime.getDate()
        const isSameMonth = now.getMonth() === sendTime.getMonth()

        const alreadySentToday =
            new Date(Number(lastSentAt)).toDateString() === now.toDateString()

        let canSend = false
        let isOneTime = false

        switch (type) {
            case ReminderType.ONE_TIME: {
                canSend = Date.now() >= sendAt && !lastSentAt && !isSent
                isOneTime = true
                break
            }

            case ReminderType.EVERYDAY: {
                canSend = isSameHour && isSameMinute && !alreadySentToday
                break
            }

            case ReminderType.EVERYWEEK: {
                canSend = isSameHour && isSameMinute && isSameWeekDay && !alreadySentToday
                break
            }

            case ReminderType.EVERYMONTH: {
                canSend = isSameHour && isSameMinute && isSameDate && !alreadySentToday
                break
            }

            case ReminderType.EVERYYEAR: {
                canSend = isSameHour && isSameMinute && isSameDate && isSameMonth && !alreadySentToday
                break
            }
        }

        return { canSend, isOneTime }
    }

    @Cron(CronExpression.EVERY_DAY_AT_10AM)
    async welcomeCron() {
        const deviceTokens = await this.deviceTokenService.getAllUser()
        if (deviceTokens) {
            for (const tokenData of deviceTokens) {
                if (tokenData.user) {
                    const sendNotificationDto: SendNotificationDto = {
                        title: "Hi, we're waiting for you!",
                        body: "It's been a while—place a new order and get started.",
                        type: 'welcome',
                        token: tokenData.token
                    }
                    await this.notificationService.sendNotification(tokenData.deviceId, sendNotificationDto)
                }
            }
        }
    }
}