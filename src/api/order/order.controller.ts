import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from 'node_modules/@nestjs/swagger/dist';
import { OrderService } from './order.service';
import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "node_modules/@nestjs/common";
import { OrderDto } from './order.dto';
import { AuthGuard } from 'src/gard/auth.guard';
import { RolesGuard } from 'src/gard/role.gaurd';
import { Roles } from 'src/decorator/role.decorator';
import { OrderStatus, OrderType, UserType } from 'src/constants/app.constants';
import { DeviceContext } from 'src/middleware/user.middleware';
import { UserDto } from '../user/user.dto';

@ApiTags("Order")
@Controller("order")
export class OrderController {

    constructor(
        private orderService: OrderService
    ) { }

    @Post('/place-order/:pid')
    @ApiParam({ name: 'pid', type: 'string', required: true })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserType.CUSTOMER)
    @ApiOperation({
        summary: "place new order", description:
            `**order type** :${Object.values(OrderType).map(s => `\`${s}\``).join(', ')}
    **order status** :${Object.values(OrderStatus).map(s => `\`${s}\``).join(', ')}\n`
    })
    @ApiBearerAuth()
    async placeOrder(
        @Req() req,
        @Param('pid') pid: string,
        @Body() orderDto: OrderDto
    ) {
        const result = await this.orderService.createOrder(req.user.uid, pid, orderDto)
        return {
            statusCode: HttpStatus.OK,
            message: "Success",
            result: result
        }
    }

    @Get('/customer')
    @UseGuards(AuthGuard, RolesGuard)
    @ApiOperation({ summary: "Get all order", description: `**Role** : ${UserType.CUSTOMER}` })
    @Roles(UserType.CUSTOMER)
    @ApiBearerAuth()
    @ApiQuery({ name: 'count', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'orderType', required: false, enum: OrderType })
    @ApiQuery({ name: 'orderStatus', required: false, enum: OrderStatus })
    async getAllOrder(
        @DeviceContext() user: UserDto,
        @Query('count') count: Number,
        @Query('limit') limit: Number,
        @Query('orderType') orderType: OrderType,
        @Query('orderStatus') OrderStatus: OrderStatus,
    ) {
        const { result, total } = await this.orderService.getAllOrder(
            user.uid,
            orderType,
            OrderStatus,
            count,
            limit
        )

        return {
            statusCode: HttpStatus.OK,
            message: "Success",
            data: result,
            meta: {
                "totalItems": total,
                "itemPerPage": Number(limit || 10),
                "totalPage": Math.ceil(Number(total) / (Number(limit) || 10)),
                "currentCount": Number(count || 0) + Number(result.length),
            }
        }
    }


    @Get('/vendor')
    @UseGuards(AuthGuard, RolesGuard)
    @ApiOperation({ summary: "Get all vendor order", description: `**Role** : ${UserType.VENDOR}` })
    @Roles(UserType.VENDOR)
    @ApiBearerAuth()
    @ApiQuery({ name: 'count', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'orderType', required: false, enum: OrderType })
    @ApiQuery({ name: 'orderStatus', required: false, enum: OrderStatus })
    async getAllVendorOrder(
        @Req() req,
        @Query('count') count: Number,
        @Query('limit') limit: Number,
        @Query('orderType') orderType: OrderType,
        @Query('orderStatus') OrderStatus: OrderStatus,
    ) {
        const { result, total } = await this.orderService.getAllVendorOrder(
            req.user.uid,
            orderType,
            OrderStatus,
            count,
            limit
        )

        return {
            statusCode: HttpStatus.OK,
            message: "Success",
            data: result,
            meta: {
                "totalItems": total,
                "itemPerPage": Number(limit || 10),
                "totalPage": Math.ceil(Number(total) / (Number(limit) || 10)),
                "currentCount": Number(count || 0) + Number(result.length),
            }
        }
    }

    @Patch("/update-status/:oid")
    @ApiOperation({ summary: "Update order status" })
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserType.CUSTOMER, UserType.VENDOR)
    @ApiParam({ name: 'oid', required: true })
    @ApiQuery({ name: 'orderStatus', required: false, enum: OrderStatus })
    async updateOrderStatus(
        @DeviceContext() user: UserDto,
        @Query('orderStatus') orderStatus: OrderStatus,
        @Param('oid') oid: string
    ) {
        const result = await this.orderService.updateOrderStatus(user.uid, oid, orderStatus)
        return result
    }
}