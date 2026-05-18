import { Module } from "node_modules/@nestjs/common";
import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";
import { TypeOrmModule } from "node_modules/@nestjs/typeorm";
import { AddressEntity } from "./address.entity";

@Module({
    imports: [TypeOrmModule.forFeature([AddressEntity])],
    controllers: [AddressController],
    providers: [AddressService],
    exports: [AddressService]
})
export class AddressModule { }