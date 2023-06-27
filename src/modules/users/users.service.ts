import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as argon from "argon2";
import { PrismaService } from "../../config/prisma/prisma.service";
import { CreateUserDto } from "./dto";
import { Users } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashPassword = await argon.hash(createUserDto.password);
    const data = {
      ...createUserDto,
      password: hashPassword,
    };

    try {
      return await this.prisma.users.create({
        data,
        select: {
          id: true,
          role: true,
          locationId: false,
          firstName: true,
          lastName: true,
          email: true,
          password: false,
          mobileNumber: false,
          description: true,
          hashRT: false,
          createdAt: true,
          updatedAt: true,
          bannedAt: true,
        },
      });
    } catch (err) {
      // Treats unique constraint from Prisma.
      if (err.code === "P2002") {
        throw new UnauthorizedException(
          "Credentials already taken, please use other credentials"
        );
      }
      throw err;
    }
  }

  async findOneById(id: string) {
    return await this.prisma.users.findUnique({ where: { id } });
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
