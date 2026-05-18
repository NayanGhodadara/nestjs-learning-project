import { DocumentType } from "src/constants/app.constants";

export class DocumentDto {
    did!: string;
    uid: string = "";
    documentType!: DocumentType;
    urls!: string[];
    uploadAt!: number;
}