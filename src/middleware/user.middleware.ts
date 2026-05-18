import { createParamDecorator, ExecutionContext } from "node_modules/@nestjs/common";
import { UserDto } from "src/api/user/user.dto";

export const DeviceContext = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserDto => {
        const req = ctx.switchToHttp().getRequest();
        return req.user
    }
)