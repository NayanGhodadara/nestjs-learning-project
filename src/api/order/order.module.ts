import { Module } from "node_modules/@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { TypeOrmModule } from "node_modules/@nestjs/typeorm";
import { OrderEntity } from "./order.entity";
import { ProductModule } from "../product/product.module";
import { AddressModule } from "../address/address.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity]),
        ProductModule,
        AddressModule
    ],
    providers: [OrderService],
    controllers: [OrderController]
})
export class OrderModule { }