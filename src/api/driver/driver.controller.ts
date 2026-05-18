import { ApiBearerAuth, ApiOperation, ApiQuery } from 'node_modules/@nestjs/swagger/dist';
import { DriverService } from './driver.service';
import { Controller, HttpStatus, Patch, UseGuards } from "node_modules/@nestjs/common";
import { RolesGuard } from 'src/gard/role.gaurd';
import { AuthGuard } from 'src/gard/auth.guard';
import { Roles } from 'src/decorator/role.decorator';
import { UserType } from 'src/constants/app.constants';
import { DeviceContext } from 'src/middleware/user.middleware';
import { UserDto } from '../user/user.dto';

@Controller("driver")
export class DriverController {
    constructor(
        private readonly driverService: DriverService
    ) { }

    @Patch("/online-offline")
    @ApiOperation({ summary: 'make driver online' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserType.DRIVER)
    @ApiBearerAuth()
    async makeDriverOnline(
        @DeviceContext() user: UserDto
    ) {
        const updatedUser = await this.driverService.makeDriverOnline(user.uid)
        return {
            statusCode: HttpStatus.OK,
            message: "Success",
            data: updatedUser
        }
    }
}