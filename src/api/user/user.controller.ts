import { AuthGuard } from 'src/gard/auth.guard';
import { UserService } from './user.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from 'node_modules/@nestjs/swagger/dist';
import { DeviceContext } from 'src/middleware/user.middleware';
import { UpdateUserDto, UserDto } from './user.dto';
import { Roles } from 'src/decorator/role.decorator';
import { UserType } from 'src/constants/app.constants';

@ApiTags('User')
@Controller("user")
export class UserController {

    constructor(private readonly userService: UserService) { }

    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user information' })
    @UseGuards(AuthGuard)
    @Get('/')
    async getUser(@Req() req) {
        const user = await this.userService.getUser(req.user.uid);
        return {
            statusCode: HttpStatus.OK,
            message: "User retrieved successfully",
            data: { ...user, authorization: { token: req.token } }
        };
    }

    @Put('/')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user' })
    @UseGuards(AuthGuard)
    @ApiBody({ type: UpdateUserDto })
    async updateUser(
        @DeviceContext() user: UserDto,
        @Body() userDto: UpdateUserDto,
    ) {
        const update = await this.userService.updateUser(user.uid, userDto);
        return {
            statusCode: HttpStatus.OK,
            message: "User retrieved successfully",
            data: { ...update }
        };
    }

    @Get('/other-users')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get other users' })
    @Roles(UserType.CUSTOMER)
    @UseGuards(AuthGuard, UseGuards)
    @ApiQuery({ name: "count", required: false })
    @ApiQuery({ name: "limit", required: false })
    async getOtherUsers(
        @DeviceContext() user: UserDto,
        @Query("count") count: number,
        @Query("limit") limit: number,
    ) {
        const { data, total } = await this.userService.getOtherUsers(user.uid, count, limit);
        return {
            statusCode: HttpStatus.OK,
            message: "Users retrieved successfully",
            data: data,
            meta: {
                "totalItems": total,
                "itemPerPage": Number(limit || 10),
                "totalPage": Math.ceil(total / (limit || 10)),
                "currentCount": Number(count || 0) + Number(data.length),
            }
        };
    }

    @Get('/other-users/:uid')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get other users details' })
    @UseGuards(AuthGuard)
    @ApiParam({ name: "uid", required: true })
    async getOtherUsersDetails(
        @DeviceContext() user: UserDto,
        @Param("uid") uid: string,
    ) {
        console.log("uid", uid)
        const data = await this.userService.getUserDetailById(uid);
        return {
            statusCode: HttpStatus.OK,
            message: "Users retrieved successfully",
            data: data
        };
    }
}