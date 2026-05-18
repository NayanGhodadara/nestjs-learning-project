import { ApiProperty } from "node_modules/@nestjs/swagger/dist";

export class SendNotificationDto {
    @ApiProperty()
    title!: string;

    @ApiProperty()
    body!: string;

    @ApiProperty()
    type!: string;

    @ApiProperty()
    token!: string;
}