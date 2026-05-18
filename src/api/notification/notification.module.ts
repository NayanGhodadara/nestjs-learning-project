import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { firebaseAdminProvider } from 'src/services/firebase-admin.provider';

@Module({
  controllers: [NotificationController],
  providers: [firebaseAdminProvider, NotificationService],
  exports: [NotificationService]
})
export class NotificationModule { }
