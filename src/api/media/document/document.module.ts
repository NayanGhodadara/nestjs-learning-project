import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DocumentService } from "./document.service";
import { DocumentEntity } from "./document.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([DocumentEntity]),
    ],
    controllers: [],
    providers: [DocumentService],
    exports: [DocumentService]
})
export class DocumentModule { }