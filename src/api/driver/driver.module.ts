import { Module } from "node_modules/@nestjs/common";
import { DriverService } from "./driver.service";
import { DriverController } from "./driver.controller";
import { UserModules } from "../user/user.module";

@Module({
    imports: [
        UserModules
    ],
    providers: [DriverService],
    controllers: [DriverController]
})
export class DriverModule { }