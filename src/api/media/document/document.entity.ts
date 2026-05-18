import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { DocumentType } from "src/constants/app.constants";
import { UserEntity } from "../../user/user.entity";

@Entity("user_documents")
export class DocumentEntity {

    @PrimaryColumn({ type: 'varchar', length: 200 })
    did: string = '';


    @ManyToOne(() => UserEntity, (user) => user.documents,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'uid' })
    user!: UserEntity;

    @Column({ type: 'enum', enum: DocumentType, default: null, nullable: true })
    documentType: DocumentType | null = null;

    @Column("simple-json", { nullable: true })
    urls: string[] = [];

    @Column({ type: 'bigint', nullable: true })
    uploadAt: number | null = null;
}