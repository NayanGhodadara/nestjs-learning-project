import { SocialLoginDto } from './social.dto';
import { ProviderType } from 'src/constants/app.constants';
import { BadRequestException, HttpCode, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/api/user/user.dto';
import { UserEntity } from 'src/api/user/user.entity';
import { DocumentType, UserType, Validation } from 'src/constants/app.constants';
import { Repository } from 'typeorm';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import * as bycrypt from 'bcrypt';
import { dateToTimestamp, generateUniqueId } from 'src/utils/app.utils';
import moment from 'moment';
import { I18nContext } from 'nestjs-i18n';
import { DocumentService } from '../media/document/document.service';
import { DocumentDto } from '../media/document/documentDto';
import { OAuth2Client } from 'node_modules/google-auth-library/build/src';
import * as appleSignin from 'apple-signin-auth';


@Injectable()
export class AuthService {

    private googleClient = new OAuth2Client(process.env.GOOGLE_WEB_CLIENTID);

    constructor(
        @InjectRepository(UserEntity)
        private authRepo: Repository<UserEntity>,
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
        private readonly documentService: DocumentService,
    ) { }

    async loginUser(userDto: UserDto, i18n: I18nContext) {

        const result = await this.authRepo.findOne({
            where: {
                email: userDto.email
            }
        });

        if (!result) {
            throw new BadRequestException(i18n.t('common.USER_NOT_FOUND'));
        }

        const isMatch = await bycrypt.compareSync(userDto.password, result.password);
        if (!isMatch) {
            throw new BadRequestException(i18n.t('common.INVALID_PASSWORD'));
        }

        const authorization = this.tokenService.createToken(result.uid as string, result.role as string);
        const documents = await this.documentService.getDocumntByUid(result.uid as string);

        const { password, ...userWithoutPassword } = result;
        let user = {
            ...userWithoutPassword,
            licenseImages: documents.filter(doc => doc.documentType === DocumentType.LICENSE).flatMap(doc => doc.urls),
            pancardImages: documents.filter(doc => doc.documentType === DocumentType.PANCARD).flatMap(doc => doc.urls),
        }
        const userData = {
            ...user,
            ...authorization
        }
        return { ...userData };
    }

    async registerUser(userDto: UserDto) {

        if (!userDto.email) {
            throw new BadRequestException("email is required");
        }
        if (!userDto.password) {
            throw new BadRequestException("password is required");
        }
        if (!userDto.password.match(Validation.PATTERN_PASSWORD)) {
            throw new BadRequestException("password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character");
        }
        if (!userDto.role) {
            throw new BadRequestException("role is required");
        }

        if (!Object.values(UserType).includes(userDto.role)) {
            throw new BadRequestException("Invalid role");
        }

        if (!userDto.licenseImages || userDto.licenseImages.length === 0) {
            throw new BadRequestException("license images are required");
        }

        if (!userDto.pancardImages || userDto.pancardImages.length === 0) {
            throw new BadRequestException("pancard images are required");
        }

        const existingUser = await this.userService.getUserByEmail(userDto.email);
        console.log("existingUser:::", existingUser);
        if (existingUser == null) {
            userDto.uid = generateUniqueId("U");
        } else {
            userDto.uid = existingUser?.uid as string
        }
        const pass = await bycrypt.hashSync(userDto.password, 10);
        userDto.password = pass;

        userDto.createdAt = dateToTimestamp(moment().toDate()) || 0;
        userDto.providerType = existingUser?.providerType || ProviderType.SYSTEM

        const licenseDto: DocumentDto = {
            did: generateUniqueId("Doc"),
            uid: userDto.uid,
            documentType: DocumentType.LICENSE,
            urls: userDto.licenseImages,
            uploadAt: dateToTimestamp(moment().toDate()) || 0
        }

        const pancardDto: DocumentDto = {
            did: generateUniqueId("Doc"),
            uid: userDto.uid,
            documentType: DocumentType.PANCARD,
            urls: userDto.pancardImages,
            uploadAt: dateToTimestamp(moment().toDate()) || 0
        }

        const userResult = await this.authRepo.save(userDto);
        await this.documentService.createDocument(licenseDto);
        await this.documentService.createDocument(pancardDto);

        let { password, ...userWithoutPassword } = userResult;
        return {
            ...userWithoutPassword
        }
    }

    async socialLogin(socialLoginDto: SocialLoginDto, i18n: I18nContext) {
        if (!socialLoginDto.email) {
            throw new BadRequestException(
                i18n.t('common.EMAIL_REQUIRED')
            );
        }
        if (!socialLoginDto.token) {
            throw new BadRequestException(
                i18n.t('common.TOKEN_REQUIRED')
            );
        }

        let userData;
        if (socialLoginDto.providerType === ProviderType.GOOGLE) {
            userData = await this.verifyGoogle(socialLoginDto.token);
        } else if (socialLoginDto.providerType === ProviderType.APPLE) {
            userData = await this.verifyApple(socialLoginDto.token);
        } else {
            throw new UnauthorizedException('Invalid provider');
        }

        let result = await this.authRepo.findOne({
            where: {
                email: socialLoginDto.email
            }
        });

        if (!result) {
            result = await this.authRepo.save({
                uid: generateUniqueId("U"),
                email: socialLoginDto.email,
                name: userData.name,
                providerType: socialLoginDto.providerType
            });
        }

        const authorization = this.tokenService.createToken(result.uid, socialLoginDto.role as string);

        return {
            ...result,
            ...authorization
        };
    }

    // GOOGLE
    private async verifyGoogle(idToken: string) {
        const token = await this.googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_WEB_CLIENT_ID,
        });

        const payload = token.getPayload();

        if (!payload?.email) {
            throw new UnauthorizedException('Invalid Google token');
        }

        return {
            email: payload.email,
            name: payload.name,
        };
    }

    // APPLE
    private async verifyApple(idToken: string) {
        const appleData = await appleSignin.verifyIdToken(idToken, {
            audience: process.env.APPLE_CLIENT_ID,
            ignoreExpiration: false,
        });

        if (!appleData?.email) {
            throw new UnauthorizedException('Invalid Apple token');
        }

        return {
            email: appleData.email,
            name: appleData.email, // Apple may not always send name
        };
    }
}