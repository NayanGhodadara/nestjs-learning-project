import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/api/user/user.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from 'node_modules/@nestjs/swagger/dist';
import { ApiHeader } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { LanguageEnum } from 'src/constants/app.constants';
import { SocialLoginDto } from './social.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'nayan@gmail.com' },
                password: { type: 'string', example: 'Nayan@123' },
            },
        },
    })
    @Post("/login")
    @ApiHeader({
        name: 'Accept-Language',
        description: 'User language',
        required: false,
        schema: {
            type: 'string',
            enum: Object.values(LanguageEnum),
            default: LanguageEnum.EN,
        },
    })
    async loginUser(
        @Body() userDto: UserDto,
        @I18n() i18n: I18nContext
    ) {
        const result = await this.authService.loginUser(userDto, i18n);
        return {
            statusCode: HttpStatus.OK,
            data: result,
            message: i18n.t('common.LOGIN_SUCCESS')
        };
    }

    @Post("/register")
    @ApiBody({ type: UserDto, description: 'Gender : male female other' })
    @ApiOperation({ summary: 'Register user' })
    async registerUser(@Body() userDto: UserDto) {
        const result = await this.authService.registerUser(userDto);
        return {
            statusCode: HttpStatus.OK,
            data: result,
            message: "Register successfully"
        }
    }

    @Post("/social-login")
    @ApiBody({ type: SocialLoginDto })
    @ApiOperation({ summary: 'Social login' })
    async socialLogin(
        @Body() socialLoginDto: SocialLoginDto,
        @I18n() i18n: I18nContext
    ) {
        const result = await this.authService.socialLogin(socialLoginDto, i18n);
        return {
            statusCode: HttpStatus.OK,
            data: result,
            message: "Register successfully"
        }
    }
}