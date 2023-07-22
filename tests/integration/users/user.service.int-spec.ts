import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { UsersRole } from "@prisma/client";
import { AppModule } from "../../../src/app.module";
import { PrismaService } from "../../../src/config/prisma/prisma.service";
import { UsersService } from "../../../src/modules/users/users.service";
import { CreateUserDto } from "../../../src/modules/users/dto";

describe("UsersService Integraton", () => {
  let prisma: PrismaService;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await prisma.cleanDatabase();
  });

  describe("create()", () => {
    it("given valid input when create user then should create user", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@test.com",
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.REGULAR,
        locationId: "49182968-da7c-40d7-8321-0229e9c2cb5e"
      };

      const createdUser = await usersService.create(createUserDto);
      const user = await usersService.findOneById(createdUser.id);
      expect(createdUser).toEqual(user);
    });

    it("given already created user when create user then should not create user and throw error", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@test.com",
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.REGULAR,
        locationId: "49182968-da7c-40d7-8321-0229e9c2cb5e"
      };
      await usersService.create(createUserDto);

      await usersService
        .create(createUserDto)
        .then((user) => expect(user).toBeUndefined())
        .catch((err) => {
          expect(err.status).toBe(401);
          expect(err).toBeInstanceOf(UnauthorizedException);
        });
    });
  });

  describe("updateUserRole()", () => {
    it("given REGULAR user when update user role then should update role to ADMIN", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@test.com",
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.REGULAR,
        locationId: "49182968-da7c-40d7-8321-0229e9c2cb5e"
      };

      const createdUser = await usersService.create(createUserDto);
      const user = await usersService.updateUserRole(
        createdUser.id,
        UsersRole.ADMIN
      );

      expect(createdUser.role).toBe(createUserDto.role);
      expect(user.role).toBe(UsersRole.ADMIN);
      expect(user.role).not.toBe(createdUser.role);
    });

    it("given non existing user when update user role then should throw not found", async () => {
      await usersService
        .updateUserRole(randomUUID(), UsersRole.ADMIN)
        .then((user) => expect(user).toBeUndefined())
        .catch((err) => {
          expect(err.status).toBe(404);
          expect(err).toBeInstanceOf(NotFoundException);
        });
    });
  });
});
