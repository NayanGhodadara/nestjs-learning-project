import { BadRequestException, Injectable } from "node_modules/@nestjs/common";
import { InjectRepository } from "node_modules/@nestjs/typeorm";
import { DeviceTokenEntity } from "./device-token.entity";
import { Repository } from "node_modules/typeorm";
import { generateUniqueId } from "src/utils/app.utils";

@Injectable()
export class DeviceTokenService {
    constructor(
        @InjectRepository(DeviceTokenEntity)
        private deviceRepo: Repository<DeviceTokenEntity>
    ) { }

    async createToken(uid, deviceId, tokenDto) {
        if (!deviceId || !tokenDto.token) {
            throw new BadRequestException("Both device id and token required!");
        }

        const userToken = await this.deviceRepo.findOne(
            {
                where: { user: { uid }, deviceId: deviceId },
            }
        )

        if (userToken) {
            userToken.token = tokenDto.token;
            const data = await this.deviceRepo.save(userToken);

            return data;
        } else {
            const deviceData = this.deviceRepo.create({
                did: generateUniqueId("D"),
                token: tokenDto.token,
                deviceId: deviceId,
                user: { uid: uid }
            })
            const result = await this.deviceRepo.save(deviceData)
            return result
        }
    }

    async findUserTokenByUid(uid) {
        const tokenData = await this.deviceRepo.findOne({
            where: { user: { uid } }
        })
        return tokenData
    }

    async getAllUser() {
        const user = await this.deviceRepo.find({
            relations: ['user']
        })
        return user
    }
}