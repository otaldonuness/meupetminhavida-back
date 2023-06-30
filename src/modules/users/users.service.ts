import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as argon from "argon2";
import { PrismaService } from "../../config/prisma/prisma.service";
import { CreateUserDto } from "./dto";
import { Users } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<Users>> {
    const { ...userRest } = createUserDto;
    const { password, ...userData } = userRest;

    const hashedPassword = await argon.hash(password);

    try {
      return await this.prisma.users.create({
        data: {
          ...userData,
          hashedPassword: hashedPassword,
        },
        select: {
          id: true,
          role: true,
          locationId: false,
          firstName: true,
          lastName: true,
          email: true,
          hashedPassword: false,
          hashedRefreshToken: false,
          mobileNumber: false,
          description: true,
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

  async findOneById(id: string): Promise<Users> {
    return await this.prisma.users.findUnique({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<Users> {
    return await this.prisma.users.findUnique({ where: { email } });
  }

  async updateHashedRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken,
      },
    });
  }

  async removeHashedRefreshToken(userId: string) {
    return await this.prisma.users.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: {
          not: null,
        },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
  }

  removeSecrets(data: Users): Users {
    data = { ...data };
    delete data.hashedPassword;
    delete data.hashedRefreshToken;
    return data;
  }
}
