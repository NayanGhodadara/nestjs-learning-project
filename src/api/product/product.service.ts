import { Repository } from 'node_modules/typeorm';
import { BadRequestException, Injectable } from "node_modules/@nestjs/common";
import { ProductDto } from "./product.dto";
import { ProductEntity } from './product.entity';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { dateToTimestamp, generateUniqueId } from 'src/utils/app.utils';
import { productMediaDto } from '../media/product/product-media.dto';
import { ProductMediaService } from '../media/product/product-media.service';
import moment from 'moment';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity)
        private productRepo: Repository<ProductEntity>,
        private readonly productMediaService: ProductMediaService
    ) { }

    async createProduct(uid, productDto: ProductDto) {
        if (!productDto.name) {
            throw new BadRequestException("name is required")
        }

        if (!productDto.description) {
            throw new BadRequestException("description is required")
        }

        if (!productDto.media || productDto.media.length === 0) {
            throw new BadRequestException("product image is required")
        }

        if (!productDto.price) {
            throw new BadRequestException("price is required")
        }

        if (productDto.mrp) {
            if (productDto.mrp < productDto.price) {
                throw new BadRequestException("mrp can't be less than price")
            }
        }

        const product = {
            pid: generateUniqueId("P"),
            name: productDto.name,
            description: productDto.description,
            mrp: productDto.mrp,
            price: productDto.price,
            user: { uid: uid }
        };
        const result = await this.productRepo.save(product)

        const productImages: productMediaDto = {
            pmid: generateUniqueId("Pm"),
            pid: result.pid,
            urls: productDto.media,
            uploadAt: dateToTimestamp(moment().toDate()) || 0
        }

        await this.productMediaService.createProduct(productImages)
        const final = await this.productRepo
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.user", "user")
            .where("product.pid = :pid", { pid: result.pid })
            .getOne()

        if (final?.user) {
            delete (final?.user as any).password;
        }
        return final;
    }

    async findProductById(pid) {
        return await this.productRepo.findOne(
            {
                where: { pid: pid },
                relations: ['user']
            }
        );
    }
}