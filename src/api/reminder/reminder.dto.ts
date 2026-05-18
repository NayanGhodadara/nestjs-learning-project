import { ApiProperty } from "node_modules/@nestjs/swagger/dist";
import { ReminderType } from "src/constants/app.constants";

export class ReminderDto {
    @ApiProperty({ example: 'birthday' })
    title!: string

    @ApiProperty({ example: 'reminder' })
    description!: string

    @ApiProperty({ example: '938439348' })
    sendAt!: number

    @ApiProperty({ enum: ReminderType })
    reminderType!: ReminderType
}