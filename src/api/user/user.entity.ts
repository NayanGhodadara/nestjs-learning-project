import { GenderType, UserType } from "src/constants/app.constants";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { AddressEntity } from "../address/address.entity";
import { DocumentEntity } from "../media/document/document.entity";
import { OrderEntity } from "../order/order.entity";
import { ProductEntity } from "../product/product.entity";
import { DeviceTokenEntity } from "../notification/device-token/device-token.entity";
import { ReminderEntity } from "../reminder/reminder.entity";
import { ChatEntity } from '../chat/chat.entity';

@Entity('user') //table name
export class UserEntity {

    @PrimaryColumn({ type: 'varchar', length: 200 })
    uid: string = '';

    @Column({ unique: true, type: 'varchar', length: 200, nullable: true })
    email: string | null = null;

    @Column({ type: 'varchar', length: 200, nullable: true, default: null })
    password: string | null = null;

    @Column({ type: 'varchar', length: 200, nullable: true, default: null })
    name: string | null = null;

    @Column({ type: 'enum', enum: GenderType, default: null })
    gender: GenderType | null = null;

    @Column({ type: 'enum', enum: UserType, default: null })
    role: UserType | null = null;

    @Column({ type: 'boolean', default: false })
    isDriverOnline!: boolean

    @Column({ type: 'boolean', default: false })
    isProfileSetup!: boolean

    @Column({ type: 'boolean', default: false })
    isOnline!: boolean

    @Column({ type: 'varchar', default: null })
    providerType!: string

    @Column({ type: 'bigint', nullable: true })
    createdAt: number | null = null;


    //Foreight keys
    @OneToMany(() => DocumentEntity, (document) => document.user)
    documents!: DocumentEntity[]

    @OneToMany(() => AddressEntity, (address) => address.user)
    addresses!: AddressEntity[]

    @OneToMany(() => ProductEntity, (product) => product.user)
    product!: ProductEntity[]

    @OneToMany(() => OrderEntity, (order) => order.user)
    order!: OrderEntity[]

    @OneToMany(() => DeviceTokenEntity, (deviceToken) => deviceToken.user)
    token!: DeviceTokenEntity[]

    @OneToMany(() => ReminderEntity, (reminder) => reminder.user)
    reminder!: ReminderEntity[]

    @OneToMany(() => ChatEntity, (chat) => chat.sender)
    sentChats!: ChatEntity[]

    @OneToMany(() => ChatEntity, (chat) => chat.receiver)
    receivedChats!: ChatEntity[]
}