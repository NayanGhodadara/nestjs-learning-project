import { SetMetadata } from "node_modules/@nestjs/common"
import { UserType } from "src/constants/app.constants"

export const ROLE_KEYS = "roles"
export function Roles(...roles: UserType[]) {
    return SetMetadata(ROLE_KEYS, roles)
}