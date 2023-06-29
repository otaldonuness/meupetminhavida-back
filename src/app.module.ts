import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import { PrismaModule } from "./config/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { PetsModule } from "./modules/pets/pets.module";
import { validate } from "./config/environment/env.validation";
import { APP_GUARD } from "@nestjs/core";
import { JwtGuard } from "./shared/guards";
import { LocationsModule } from "./modules/locations/locations.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      cache: true,
    }),
    AuthModule,
    UsersModule,
    PetsModule,
    PrismaModule,
    LocationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
