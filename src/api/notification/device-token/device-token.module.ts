import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "node_modules/@nestjs/common";
import { DeviceTokenEntity } from './device-token.entity';
import { DeviceTokenController } from './device-token.controller';
import { DeviceTokenService } from './device-token.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([DeviceTokenEntity]),
    ],
    controllers: [
        DeviceTokenController
    ],
    providers: [
        DeviceTokenService
    ],
    exports: [
        DeviceTokenService
    ]
})
export class DeviceTokenModule {

}