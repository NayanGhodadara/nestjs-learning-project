import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "node_modules/@nestjs/common";
import { Reflector } from '@nestjs/core';
import { Observable } from "node_modules/rxjs/dist/types";
import { UserType } from "src/constants/app.constants";
import { ROLE_KEYS } from "src/decorator/role.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        //Anotation value (@Role(UserType.CUSTOMER))
        const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
            ROLE_KEYS,
            [
                context.getHandler(),
                context.getClass()
            ]
        )

        if (!requiredRoles) return true;


        const req = context.switchToHttp().getRequest();
        const user = req.user;

        if (!user) {
            throw new ForbiddenException('User not found');
        }

        const hasRole = requiredRoles.includes(user.role);

        if (!hasRole) {
            throw new ForbiddenException('You are not allow to access this resources');
        }

        return true;
    }
}