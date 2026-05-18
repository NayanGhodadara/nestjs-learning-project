import { Module } from "node_modules/@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "node_modules/@nestjs/typeorm";
import { ProductEntity } from "./product.entity";
import { ProductMediaModule } from "../media/product/product-media.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductEntity]),
        ProductMediaModule
    ],
    providers: [ProductService],
    controllers: [ProductController],
    exports: [ProductService]
})
export class ProductModule {

}