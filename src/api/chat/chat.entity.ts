import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "node_modules/typeorm";
import { UserEntity } from "../user/user.entity";

@Entity('chat')
export class ChatEntity {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    chatId!: string;

    @Column({ type: 'varchar', length: 200, default: null })
    message!: string;

    @Column({ type: 'bigint' })
    createdAt!: number;

    @ManyToOne(() => UserEntity, (user) => user.sentChats)
    @JoinColumn({ name: 'senderUid' })
    sender!: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.receivedChats)
    @JoinColumn({ name: 'receiverUid' })
    receiver!: UserEntity;
}