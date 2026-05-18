import { DataSource, type DataSourceOptions } from 'typeorm';
import { AddressEntity } from "src/api/address/address.entity";
import { DocumentEntity } from "src/api/media/document/document.entity";
import { ProductMediaEntity } from "src/api/media/product/product-media.entity";
import { DeviceTokenEntity } from "src/api/notification/device-token/device-token.entity";
import { OrderEntity } from "src/api/order/order.entity";
import { ProductEntity } from "src/api/product/product.entity";
import { ReminderEntity } from "src/api/reminder/reminder.entity";
import { UserEntity } from "src/api/user/user.entity";

import * as dotenv from 'dotenv';
import { ChatEntity } from 'src/api/chat/chat.entity';
dotenv.config();

export const databaseSourceOption: DataSourceOptions = {
    type: "postgres",
    host: "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
        UserEntity,
        DocumentEntity,
        ProductMediaEntity,
        AddressEntity,
        ProductEntity,
        OrderEntity,
        DeviceTokenEntity,
        ReminderEntity,
        ChatEntity
    ],
    synchronize: process.env.NODE_ENV !== 'production',
}

export const dataSource = new DataSource(databaseSourceOption);