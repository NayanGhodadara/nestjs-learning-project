import { ApiProperty } from "node_modules/@nestjs/swagger/dist"
import { UserType } from "src/constants/app.constants"

export class SocialLoginDto {

    @ApiProperty({ type: 'string', example: 'Qdv20or3f234542345....' })
    token!: string

    @ApiProperty({ type: 'string', example: 'test@gmail.com' })
    email!: string

    @ApiProperty({ type: 'string' })
    providerType!: string

    @ApiProperty({ enum: UserType })
    role!: UserType
}