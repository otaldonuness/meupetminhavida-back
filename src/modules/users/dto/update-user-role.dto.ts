import { UsersRole } from '@prisma/client'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class UpdateUserRoleDto {
    @IsEnum(UsersRole)
    @IsNotEmpty()
    newRole: UsersRole = UsersRole.REGULAR
}
