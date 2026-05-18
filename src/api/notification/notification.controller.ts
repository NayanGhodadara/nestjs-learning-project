import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './sendNotificationDto';
import { ApiHeader } from 'node_modules/@nestjs/swagger/dist';

@Controller('send-notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post("/")
  @ApiHeader({
    name: "deviceId",
    required: false,
    schema: {
      type: 'string',
      default: 'a4cde38fc5709be7'
    }
  })
  async sendNotification(@Req() req, @Body() sendNotificationDto: SendNotificationDto) {
    const deviceId = req.headers['deviceid'];

    const result = await this.notificationService.sendNotification(deviceId, sendNotificationDto);
    return {
      statusCode: HttpStatus.OK,
      message: "Send successfully",
      data: result
    };
  }
}
