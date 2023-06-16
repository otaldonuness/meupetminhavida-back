import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './config/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
