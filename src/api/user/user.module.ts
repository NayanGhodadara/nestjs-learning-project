import { forwardRef, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { DocumentModule } from "../media/document/document.module";
import { DeviceTokenEntity } from "../notification/device-token/device-token.entity";
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        DocumentModule,
        forwardRef(() => AuthModule)
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModules { }