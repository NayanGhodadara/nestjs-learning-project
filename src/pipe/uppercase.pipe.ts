import { PipeTransform } from "node_modules/@nestjs/common";
import { convertToUppercase } from "src/utils/app.utils";

export class UpperCasePipe implements PipeTransform {
    transform(value: any): string {
        return convertToUppercase(value);
    }
}