import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { UsersRole } from "@prisma/client"
import { Observable } from "rxjs"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UsersRole[]>(
      "roles",
      [context.getHandler(), context.getClass()]
    )

    if (!requiredRoles) {
      return true // No roles required, allow access.
    }

    const { user } = context.switchToHttp().getRequest()

    return requiredRoles.includes(user.role)
  }
}
