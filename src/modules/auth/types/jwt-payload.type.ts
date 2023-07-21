import { UsersRole } from "@prisma/client";

export type JwtPayload = {
  sub: string;
  email: string;
  role: UsersRole;
  refreshToken?: string;
};
