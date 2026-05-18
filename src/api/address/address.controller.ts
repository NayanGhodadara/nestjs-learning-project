import { AddressDto } from './address.dto';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from "node_modules/@nestjs/common";
import { AddressService } from "./address.service";
import { AuthGuard } from 'src/gard/auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery } from 'node_modules/@nestjs/swagger/dist';
import { AddressType, UserType } from 'src/constants/app.constants';
import { Roles } from 'src/decorator/role.decorator';
import { RolesGuard } from 'src/gard/role.gaurd';

@Controller("address")
export class AddressController {

    constructor(
        private readonly addressService: AddressService
    ) { }

    @Post("/")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserType.CUSTOMER)
    @ApiOperation({ summary: "Create address" })
    @ApiBearerAuth()
    @ApiBody({ type: AddressDto, description: "addressType : home, work, other" })
    async createAddress(@Body() AddressDto: AddressDto, @Req() req) {
        const result = await this.addressService.createAddress(AddressDto, req.user.uid);
        return {
            statusCode: HttpStatus.OK,
            message: "Address created successfully",
            data: { ...result }
        };
    }

    @Get("/")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserType.CUSTOMER)
    @ApiOperation({ summary: "Get all addresses of user" })
    @ApiBearerAuth()
    @ApiQuery({ name: "count", required: false })
    @ApiQuery({ name: "limit", required: false })
    @ApiQuery({ name: "filter", required: false, enum: AddressType })
    async getAllAddresses(
        @Query("count") count: number,
        @Query("limit") limit: number,
        @Query("filter") filter: AddressType,
        @Req() req
    ) {
        const { data, total } = await this.addressService.getAllAddress(req.user.uid, filter, count, limit);
        return {
            statusCode: HttpStatus.OK,
            message: "Addresses fetched successfully",
            data: data,
            meta: {
                "totalItems": total,
                "itemPerPage": Number(limit || 10),
                "totalPage": Math.ceil(total / (limit || 10)),
                "currentCount": Number(count || 0) + Number(data.length),
            }
        };
    }


    @Delete("/:aid")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserType.CUSTOMER)
    @ApiOperation({ summary: "Delete address by id" })
    @ApiBearerAuth()
    @ApiParam({ name: "aid", required: true })
    async deleteAddress(@Param("aid") aid: string, @Req() req) {
        await this.addressService.deleteAddress(aid, req.user.uid);
        return {
            statusCode: HttpStatus.OK,
            message: "Address deleted successfully",
        };
    }

    @Put("/:aid")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserType.CUSTOMER)
    @ApiOperation({ summary: "Update address" })
    @ApiBearerAuth()
    @ApiParam({ name: "aid", required: true })
    @ApiBody({ type: AddressDto, description: "addressType : home, work, other" })
    async updateAddress(@Param("aid") aid: string, @Body() addressDto: AddressDto, @Req() req) {
        const data = await this.addressService.updateAddress(aid, addressDto, req.user.uid);
        return {
            statusCode: HttpStatus.OK,
            data: data,
            message: "Address updated successfully",
        }
    }

}