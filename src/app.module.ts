import { databaseSourceOption } from './database/database-source';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'src/api/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModules } from './api/user/user.module';
import { TokenModule } from './api/token/token.module';
import { AddressModule } from './api/address/address.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { NotificationModule } from './api/notification/notification.module';
import { DocumentModule } from './api/media/document/document.module';
import { ProductModule } from './api/product/product.module';
import { OrderModule } from './api/order/order.module';
import { DeviceTokenModule } from './api/notification/device-token/device-token.module';
import { ScheduleModule } from 'node_modules/@nestjs/schedule';
import { ReminderModule } from './api/reminder/reminder.module';
import { DriverModule } from './api/driver/driver.module';
import { SocketModule } from './api/socket/socket.module';
import { ChatModule } from './api/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    TypeOrmModule.forRoot(databaseSourceOption),
    ScheduleModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: { path: join(__dirname, '/i18n/'), watch: true },
      typesOutputPath: join(__dirname, '../src/generated/i18n.generated.ts'),
      resolvers: [
        { use: HeaderResolver, options: ['accept-language'] },
      ]
    }),
    AuthModule,
    UserModules,
    DocumentModule,
    TokenModule,
    AddressModule,
    NotificationModule,
    ProductModule,
    OrderModule,
    DeviceTokenModule,
    ReminderModule,
    DriverModule,
    SocketModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
