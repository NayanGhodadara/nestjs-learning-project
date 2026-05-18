import { ProductDto } from './product.dto';
import { Body, Controller, Get, HttpStatus, Post, Req, UseGuards } from "node_modules/@nestjs/common";
import { ProductService } from "./product.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from 'node_modules/@nestjs/swagger/dist';
import { AuthGuard } from 'src/gard/auth.guard';
import { RolesGuard } from 'src/gard/role.gaurd';
import { Roles } from 'src/decorator/role.decorator';
import { UserType } from 'src/constants/app.constants';

@Controller("product")
export class ProductController {

    constructor(
        private productService: ProductService
    ) { }

    @Post("/")
    @ApiBody({ type: ProductDto })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserType.VENDOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create new order" })
    async createProduct(@Req() req, @Body() productDto: ProductDto) {
        const result = await this.productService.createProduct(req.user.uid, productDto)
        return {
            statusCode: HttpStatus.OK,
            messag: "Product created successfully",
            data: result
        }
    }

}