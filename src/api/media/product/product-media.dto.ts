import { DocumentType } from "src/constants/app.constants";

export class productMediaDto {
    pmid!: string;
    pid: string = "";
    urls!: string[];
    uploadAt!: number;
}