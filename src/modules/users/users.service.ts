import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateUserDto } from './dto';
import { Users } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    return await this.prisma.users.create({ data });
  }

  async findOneById(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    return user;
  }

  async findOneByEmail(email: string) {
    return await this.prisma.users.findUnique({ where: { email } });
  }

  removeHashPassword(data: Users) {
    data = { ...data };
    delete data.password;
    return data;
  }
}
