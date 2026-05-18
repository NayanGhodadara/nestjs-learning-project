import { AuthService } from './../auth/auth.service';
import { UpdateUserDto, UserDto } from 'src/api/user/user.dto';
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Not, Repository } from "typeorm";
import { DocumentType, UserType } from "src/constants/app.constants";
import { DocumentService } from "../media/document/document.service";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        private readonly documentService: DocumentService
    ) { }

    async getUser(uid: string) {
        const user = await this.userRepo.findOne({
            where: {
                uid: uid
            }
        });
        if (!user) return null;
        const documents = await this.documentService.getDocumntByUid(user.uid as string);

        const { password, ...safeUser } = user;
        let userData = {
            ...safeUser,
            licenseImages: documents.filter(doc => doc.documentType === DocumentType.LICENSE).flatMap(doc => doc.urls),
            pancardImages: documents.filter(doc => doc.documentType === DocumentType.PANCARD).flatMap(doc => doc.urls),
        }
        return userData;
    }

    async updateUser(uid: string, userDto: UpdateUserDto) {
        await this.userRepo.update(
            {
                uid: uid
            },
            {
                ...userDto
            }
        )

        const newUser = await this.getUserByUid(uid);
        if ((newUser as any).passowrd) {
            delete (newUser as any).password
        }

        return newUser
    }

    async getOtherUsers(uid: string, count = 0, limit = 10) {
        /*const [data, total] = await this.userRepo.findAndCount({
            where: {
                uid: Not(uid),
            },
            skip: count,
            take: limit
        });*/

        const [data, total] = await this.userRepo.createQueryBuilder('user')
            .where('user.uid != :uid', { uid })
            .orderBy('user.createdAt', 'ASC')
            .skip(count)
            .take(limit)
            .getManyAndCount();

        const safeData = data.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        })

        return { data: safeData, total }
    }

    async getUserDetailById(uid: string) {
        const data = await this.userRepo.findOne({
            where: {
                uid: uid,
            },
        });
        if (!data) return null;

        const { password, ...safeUser } = data;

        return { ...safeUser }
    }

    async makeDriverOnline(uid: string) {
        const user = await this.getUserByUid(uid);
        await this.userRepo.update(
            {
                uid: uid
            },
            {
                isDriverOnline: !user?.isDriverOnline
            }
        )

        const newUser = await this.getUserByUid(uid);
        if ((newUser as any).passowrd) {
            delete (newUser as any).password
        }

        return newUser
    }

    async changeOnlineStatus(uid: string, isOnline: boolean) {

        const existingUser = await this.userRepo.findOne({
            where: { uid }
        });

        const result = await this.userRepo.update(
            { uid },
            { isOnline }
        );

        return result;
    }

    async getUserByUid(uid: string) {
        const user = await this.userRepo.findOne({
            where: {
                uid: uid
            }
        });
        if (!user) return null;
        const { password, ...safeUser } = user;
        return safeUser;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepo.findOne({
            where: {
                email: email
            }
        });
        if (!user) return null;
        const { password, ...safeUser } = user;
        return safeUser;
    }
}