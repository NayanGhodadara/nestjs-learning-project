import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "node_modules/typeorm";
import { UserEntity } from "../user/user.entity";
import { ReminderType } from "src/constants/app.constants";

@Entity('reminder')
export class ReminderEntity {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    rid!: string

    @Column({ type: 'varchar', length: 200 })
    title!: string

    @Column({ type: 'varchar', length: 200 })
    description!: string

    @Column({ type: 'bigint' })
    sendAt!: number

    @Column({ type: 'enum', enum: ReminderType, default: ReminderType.EVERYDAY })
    reminderType!: ReminderType

    @Column({ type: 'boolean', default: false })
    isSent!: boolean

    @Column({ type: 'bigint', default: null })
    lastSentAt!: number

    @ManyToOne(() => UserEntity, (user) => user.reminder, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'uid' })
    user!: UserEntity
}