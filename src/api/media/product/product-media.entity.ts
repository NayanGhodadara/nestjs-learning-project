import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { DocumentType } from "src/constants/app.constants";
import { UserEntity } from "../../user/user.entity";
import { ProductEntity } from "../../product/product.entity";

@Entity("product_media")
export class ProductMediaEntity {

    @PrimaryColumn({ type: 'varchar', length: 200 })
    pmid: string = '';

    @ManyToOne(() => ProductEntity, (product) => product.productImages,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'pid' })
    product!: ProductEntity;

    @Column("simple-json", { nullable: true })
    urls: string[] = [];

    @Column({ type: 'bigint', nullable: true })
    uploadAt: number | null = null;
}