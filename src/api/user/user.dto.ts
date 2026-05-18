import { ApiProperty, OmitType } from "node_modules/@nestjs/swagger/dist";
import { IsNotEmpty, Matches } from "class-validator";
import { GenderType, UserType, Validation } from "src/constants/app.constants";

export class UserDto {
    @ApiProperty({ example: 'U1231ow20320390', required: false })
    uid!: string;

    @ApiProperty({ example: 'user@example.com' })
    @IsNotEmpty({ message: 'Email is required' })
    email!: string;

    @ApiProperty({ example: 'Password123' })
    @IsNotEmpty({ message: 'Password is required' })
    @Matches(Validation.PATTERN_PASSWORD as any, { message: 'Invalid passowrd' })
    password!: string;

    @ApiProperty({ example: 'John Doe' })
    name!: string;

    @ApiProperty({ example: 'false', default: false })
    isDriverOnline!: boolean

    @ApiProperty({ example: 'false', default: false })
    isProfileSetup!: boolean

    @ApiProperty({ example: 'google', default: null })
    providerType!: string

    @ApiProperty({ example: 'male', default: null })
    gender!: GenderType;

    @ApiProperty({ example: ['test.png'] })
    licenseImages!: string[];

    @ApiProperty({ example: ['test.png'] })
    pancardImages!: string[];

    @ApiProperty({ example: 'customer' })
    role!: UserType;

    createdAt!: number;
}

export class UpdateUserDto extends OmitType(
    UserDto,
    [
        'uid',
        'password',
        'email',
        'isDriverOnline',
    ] as const
) { }