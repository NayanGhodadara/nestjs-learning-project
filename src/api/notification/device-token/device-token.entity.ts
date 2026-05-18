import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "node_modules/typeorm";
import { UserEntity } from "src/api/user/user.entity";

@Entity('device_token')
export class DeviceTokenEntity {

    @PrimaryColumn({ type: 'varchar', length: 50 })
    did!: string

    @Column({ type: 'varchar', length: 500 })
    token!: string

    @Column({ type: 'varchar', length: 100 })
    deviceId!: string

    @ManyToOne(() => UserEntity, (user) => user.token, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'uid' })
    user!: UserEntity
}