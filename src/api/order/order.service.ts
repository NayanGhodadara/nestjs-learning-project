import { AddressService } from './../address/address.service';
import { ProductService } from './../product/product.service';
import moment from 'moment';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { OrderDto } from './order.dto';
import { BadRequestException, Injectable } from "node_modules/@nestjs/common";
import { OrderEntity } from './order.entity';
import { Repository } from 'node_modules/typeorm';
import { dateToTimestamp, generateUniqueId } from 'src/utils/app.utils';
import { OrderStatus, OrderType } from 'src/constants/app.constants';

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(OrderEntity)
        private orderRepo: Repository<OrderEntity>,
        private readonly ProductService: ProductService,
        private readonly AddressService: AddressService
    ) { }

    async createOrder(uid, pid, orderDto: OrderDto) {
        if (!pid) {
            throw new BadRequestException("pid is required")
        }

        if (!orderDto.aid) {
            throw new BadRequestException("aid is required")
        }

        const oid = generateUniqueId("D2D")

        const productResult = await this.ProductService.findProductById(pid);

        if (!productResult) {
            throw new BadRequestException("Product not found")
        }

        const addressResult = await this.AddressService.findAddressById(orderDto.aid);
        if (!addressResult) {
            throw new BadRequestException("address not found")
        }

        const order = {
            oid,
            orderType: orderDto.orderType,
            createdAt: dateToTimestamp(moment().toDate()) || 0,
            user: { uid },
            vendor: { uid: (productResult?.user)?.uid },
            product: { pid },
            address: { aid: orderDto.aid },
        };

        await this.orderRepo.save(order)
        const result = await this.orderRepo
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.vendor", "vendor")
            .leftJoinAndSelect("order.product", "product")
            .leftJoinAndSelect("order.address", "address")
            .where("order.oid = :oid", { oid })
            .getOne()

        if (result?.user) {
            delete (result.user as any).password;
        }
        return result
    }

    async updateOrderStatus(uid: string, oid: string, status: OrderStatus) {
        const order = await this.orderRepo.findOne({ where: { oid: oid }, relations: ['user', 'address', 'vendor', 'product'] })
        if (!order) {
            throw new BadRequestException("Order not found")
        }

        order.orderStatus = status
        await this.orderRepo.save(order)
        return order
    }

    async getAllOrder(
        uid: string,
        orderType: OrderType,
        orderStatus: OrderStatus,
        count,
        limit
    ) {
        const query = this.orderRepo
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.user", "user")
            .leftJoinAndSelect("order.product", "product")
            .leftJoinAndSelect("order.address", "address")
            .where("order.uid = :uid", { uid })

        if (orderType) {
            query.where("order.orderType = :orderType", { orderType })
        }

        if (orderStatus) {
            query.where("order.orderStatus = :orderStatus", { orderStatus })
        }

        const [result, total] = await query
            .skip(count || 0)
            .take(limit || 10)
            .getManyAndCount()

        return { result, total }
    }

    async getAllVendorOrder(
        uid: string,
        orderType: OrderType,
        orderStatus: OrderStatus,
        count,
        limit
    ) {
        const query = this.orderRepo
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.user", "user")
            .leftJoinAndSelect("order.vendor", "vendor")
            .leftJoinAndSelect("order.product", "product")
            .leftJoinAndSelect("order.address", "address")
            .where("vendor.uid = :uid", { uid })

        if (orderType) {
            query.where("order.orderType = :orderType", { orderType })
        }

        if (orderStatus) {
            query.where("order.orderStatus = :orderStatus", { orderStatus })
        }

        const [result, total] = await query
            .skip(count || 0)
            .take(limit || 10)
            .getManyAndCount()

        return { result, total }
    }
}