import { map } from 'rxjs/operators';
import { NestInterceptor } from "node_modules/@nestjs/common";
import { convertToUppercase } from 'src/utils/app.utils';

export class UppercaseInterceptor implements NestInterceptor {
    intercept(context: any, call$: any) {
        //request interception logic but we use pip for learning
        /*const request = context.switchToHttp().getRequest();
        if (request.body) {
            for (const key in request.body) {
                if (typeof request.body[key] === 'string') {
                    request.body[key] = request.body[key].toUpperCase();
                }
            }
        }
        return call$.handle();*/

        //response interception logic
        return call$.handle().pipe(map((data) => {
            return convertToUppercase(data)
        }));
    }
}