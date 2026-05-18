import { ApiProperty } from "node_modules/@nestjs/swagger/dist";
import { Expose } from 'class-transformer'
import { OrderStatus, OrderType } from "src/constants/app.constants";
import { IsEmpty } from "node_modules/class-validator/types";

export class OrderDto {
    oid!: string

    @ApiProperty({ type: 'string', example: "A123d2345" })
    aid!: string

    @ApiProperty({ enum: OrderType })
    orderType!: string

    @ApiProperty({ enum: OrderStatus })
    orderStatus!: string

    createdAt!: number
}