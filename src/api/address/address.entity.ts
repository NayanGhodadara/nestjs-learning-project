import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { AddressType } from "src/constants/app.constants";
import { UserEntity } from "../user/user.entity";

@Entity("address")
@Index("IDX_address_uid_addressType", ["addressType", "user"])
export class AddressEntity {

    @PrimaryColumn({ type: 'varchar', length: 200 })
    aid!: string;

    @Column({ type: 'varchar', length: 200 })
    address!: string;

    @Column({ type: 'decimal' })
    longitude!: number;

    @Column({ type: 'decimal' })
    latitude!: number;

    @Column({ type: 'boolean', default: false })
    isDefault!: boolean;

    @Column({ type: 'enum', enum: AddressType, default: AddressType.OTHER })
    addressType!: AddressType;

    @ManyToOne(() => UserEntity, user => user.addresses,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: "uid" })
    user!: UserEntity;
}