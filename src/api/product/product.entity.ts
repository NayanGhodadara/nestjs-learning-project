import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "node_modules/typeorm";
import { ProductMediaEntity } from "../media/product/product-media.entity";
import { OrderEntity } from "../order/order.entity";
import { UserEntity } from "../user/user.entity";

@Entity("product")
export class ProductEntity {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    pid!: string

    @Column({ type: 'varchar', length: 50 })
    name!: string

    @Column({ type: 'varchar', length: 500 })
    description!: string

    @Column({ type: 'decimal' })
    mrp!: number

    @Column({ type: 'decimal' })
    price!: number

    //Foreight keys
    @ManyToOne(() => UserEntity, (user) => user.product, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'uid' })
    user!: UserEntity;

    @OneToMany(() => ProductMediaEntity, (productMedia) => productMedia.product)
    productImages!: ProductMediaEntity[]

    @OneToMany(() => OrderEntity, (order) => order.product)
    order!: OrderEntity[]
}