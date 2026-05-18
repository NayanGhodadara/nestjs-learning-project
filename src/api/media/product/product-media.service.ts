import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductMediaEntity } from "./product-media.entity";
import { productMediaDto } from "./product-media.dto";

@Injectable()
export class ProductMediaService {

    constructor(
        @InjectRepository(ProductMediaEntity)
        private readonly repository: Repository<ProductMediaEntity>
    ) { }

    async createProduct(productMediaDto: productMediaDto) {

        let urls = productMediaDto.urls || [];
        if (urls.length == 0) {
            throw new BadRequestException("At least one image is required");
        }

        let productMedia = this.repository.create({
            pmid: productMediaDto.pmid,
            product: { pid: productMediaDto.pid },
            urls: productMediaDto.urls,
            uploadAt: productMediaDto.uploadAt
        });

        return await this.repository.save(productMedia);
    }


    async getProductByPid(pid: string) {
        const result = await this.repository
            .createQueryBuilder("product_media")
            .innerJoin("product_media.productImages", "productImages")
            .where("productImages.pid = :pid", { pid })
            .getMany();

        return result;
    }
}