import { SetMetadata } from "@nestjs/common";
import { UsersRole } from "@prisma/client";

export const Roles = (...roles: UsersRole[]) => SetMetadata("roles", roles);
