import { ApiProperty } from "node_modules/@nestjs/swagger/dist";

export class DeviceTokenDto {
    @ApiProperty({ example: "evFxneANRjqKXz_sCAnz-x:APA91bG2mf_HSJwKGtv43zGZxd4D_OY_wjyJk7SeElJVOeKFcAUx59teRbM3EcKVKRtTowdCV-UB1djbcHF0-Hwo5p6BfXxWu4YSnKeneZsBFowQu55tvqE" })
    token!: string

}