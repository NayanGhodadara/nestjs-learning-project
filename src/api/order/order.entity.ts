import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "node_modules/typeorm";
import { OrderStatus, OrderType } from "src/constants/app.constants";
import { UserEntity } from "../user/user.entity";
import { ProductEntity } from "../product/product.entity";
import { AddressDto } from "../address/address.dto";
import { AddressEntity } from "../address/address.entity";

@Entity('order')
export class OrderEntity {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    oid: string = ''

    @Column({ type: 'enum', enum: OrderType, default: OrderType.INSTANT })
    orderType!: string

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    orderStatus!: string

    @Column({ type: 'bigint' })
    createdAt!: number


    //Foreign
    @ManyToOne(() => UserEntity, user => user.order, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "uid" })
    user!: UserEntity

    @ManyToOne(() => UserEntity, user => user.order, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "vid" })
    vendor!: UserEntity

    @ManyToOne(() => ProductEntity, product => product.order, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "pid" })
    product!: ProductEntity

    @ManyToOne(() => AddressEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "aid" })
    address!: AddressEntity;
}