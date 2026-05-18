import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductMediaService } from "./product-media.service";
import { ProductMediaEntity } from "./product-media.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductMediaEntity]),
    ],
    controllers: [],
    providers: [ProductMediaService],
    exports: [ProductMediaService]
})
export class ProductMediaModule { }