import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { UsersModule } from './modules/users/users.module'
import { PrismaModule } from './config/prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { PetsModule } from './modules/pets/pets.module'
import { SpeciesModule } from './modules/species/species.module'
import { validate } from './config/environment/env.validation'
import { JwtGuard } from './shared/guards'
import { LocationsModule } from './modules/locations/locations.module'
import { LoggerMiddleware } from './shared/middlewares'

@Module({
    imports: [
        ConfigModule.forRoot({
            validate,
            isGlobal: true,
            cache: true
        }),
        AuthModule,
        UsersModule,
        PetsModule,
        LocationsModule,
        PrismaModule,
        SpeciesModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtGuard
        }
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*')
    }
}
