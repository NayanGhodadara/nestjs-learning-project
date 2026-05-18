import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DocumentDto } from "./documentDto";
import { DocumentEntity } from "./document.entity";

@Injectable()
export class DocumentService {

    constructor(
        @InjectRepository(DocumentEntity)
        private readonly repository: Repository<DocumentEntity>
    ) { }

    async createDocument(documentDto: DocumentDto) {

        let urls = documentDto.urls || [];
        if (urls.length == 0) {
            throw new BadRequestException("At least one document is required");
        }

        if (urls.length > 2) {
            throw new BadRequestException("You can upload a maximum of 2 documents");
        }

        let document = this.repository.create({
            did: documentDto.did,
            user: { uid: documentDto.uid },
            documentType: documentDto.documentType,
            urls: documentDto.urls,
            uploadAt: documentDto.uploadAt
        });

        return await this.repository.save(document);
    }


    async getDocumntByUid(uid: string) {
        const result = await this.repository
            .createQueryBuilder("document")
            .innerJoin("document.user", "user")
            .where("user.uid = :uid", { uid })
            .getMany();

        return result;
    }
}