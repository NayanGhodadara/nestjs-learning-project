import { Injectable } from "node_modules/@nestjs/common";
import { UserService } from '../user/user.service';

@Injectable()
export class DriverService {
    constructor(
        private userService: UserService
    ) { }

    async makeDriverOnline(uid: string) {
        return await this.userService.makeDriverOnline(uid)
    }
}