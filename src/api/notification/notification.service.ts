import { Injectable } from '@nestjs/common';
import { SendNotificationDto } from './sendNotificationDto';
import * as firebase from 'firebase-admin';

@Injectable()
export class NotificationService {
  async sendNotification(deviceIds: string, notification: SendNotificationDto) {
    try {
      await firebase
        .messaging()
        .send(
          {
            token: notification.token,
            data: {
              title: notification.title,
              body: notification.body,
              type: notification.type,
            },
            android: {
              priority: 'high',
              notification: {
                sound: 'default',
                channelId: 'default',
              },
            },
            apns: {
              headers: {
                'apns-priority': '10',
              },
              payload: {
                aps: {
                  contentAvailable: true,
                  sound: 'default',
                },
              },
            },
          })
        .catch((error: any) => {
          throw new Error(error)
        });
    } catch (error: any) {
      throw new Error(error)
    }
  }


}
