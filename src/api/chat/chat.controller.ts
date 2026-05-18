import { Controller, Get, HttpStatus, ParseIntPipe, Query, UseGuards } from "node_modules/@nestjs/common";
import { ApiBearerAuth, ApiExcludeController, ApiOperation, ApiQuery } from "node_modules/@nestjs/swagger/dist";
import { ChatService } from "./chat.service";
import { Roles } from "src/decorator/role.decorator";
import { AuthGuard } from "src/gard/auth.guard";
import { DeviceContext } from "src/middleware/user.middleware";
import { UserDto } from "../user/user.dto";

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService
    ) {

    }

    @Get('/')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get chat list' })
    @UseGuards(AuthGuard)
    @ApiQuery({ name: "count", required: false })
    @ApiQuery({ name: "receiverUid", required: true })
    @ApiQuery({ name: "limit", required: false })
    async getAllchat(
        @DeviceContext() user: UserDto,
        @Query("receiverUid") receiverUid: string,
        @Query("count", ParseIntPipe) count: number,
        @Query("limit", ParseIntPipe) limit: number,
    ) {
        const { data, total } = await this.chatService.getAllchat(user.uid, receiverUid, count, limit);
        return {
            statusCode: HttpStatus.OK,
            message: "Chat retrieved successfully",
            data: data,
            meta: {
                "totalItems": total,
                "itemPerPage": Number(limit || 10),
                "totalPage": Math.ceil(total / (limit || 10)),
                "currentCount": Number(count || 0) + Number(data.length),
            }
        };
    }
}
