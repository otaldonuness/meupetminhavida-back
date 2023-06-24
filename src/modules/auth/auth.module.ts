import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy";
import { UsersService } from "../users/users.service";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_SECRET,
      signOptions: {
        expiresIn: process.env.TOKEN_EXPIRES,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService],
})
export class AuthModule {}
