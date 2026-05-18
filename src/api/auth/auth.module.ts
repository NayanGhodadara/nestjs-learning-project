import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/api/user/user.entity';
import { TokenModule } from '../token/token.module';
import { UserModules } from '../user/user.module';
import { DocumentModule } from '../media/document/document.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        TokenModule,
        UserModules,
        DocumentModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }