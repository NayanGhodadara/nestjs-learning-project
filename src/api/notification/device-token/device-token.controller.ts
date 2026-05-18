import { Body, Controller, HttpStatus, Post, Req, UseGuards } from "node_modules/@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from "node_modules/@nestjs/swagger/dist";
import { DeviceTokenService } from "./device-token.service";
import { AuthGuard } from "src/gard/auth.guard";
import { DeviceTokenDto } from "./device-token.dto";

@ApiTags('Notification')
@Controller('device-token')
export class DeviceTokenController {
    constructor(
        private readonly deviceTokenService: DeviceTokenService
    ) { }


    @Post('/')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create device token for notification' })
    @ApiHeader({
        name: "deviceId",
        required: false,
        schema: {
            type: 'string',
            default: '0c95276aa5eba4ce'
        }
    })
    async createDeviceToken(
        @Req() req,
        @Body() deviceTokenDto: DeviceTokenDto
    ) {
        const deviceId = req.headers['deviceid']
        const result = this.deviceTokenService.createToken(req.user.uid, deviceId, deviceTokenDto)
        return {
            statusCode: HttpStatus.OK,
            message: "Success",
            data: result
        }
    }
}