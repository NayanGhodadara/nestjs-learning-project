import { ApiProperty } from "node_modules/@nestjs/swagger/dist";
import { ManyToOne } from "node_modules/typeorm";
import { AddressType } from "src/constants/app.constants";
import { UserEntity } from "../user/user.entity";

export class AddressDto {
    @ApiProperty({ example: "A1230294503" })
    aid!: string;

    uid!: string;

    @ApiProperty({ example: "123 Main St" })
    address!: string;

    @ApiProperty({ example: "false" })
    isDefault!: boolean;

    @ApiProperty({ example: 40.7128 })
    longitude!: number;

    @ApiProperty({ example: -74.0060 })
    latitude!: number;

    @ApiProperty({ enum: ['home', 'work', 'other'], example: "home" })
    addressType!: AddressType;
}