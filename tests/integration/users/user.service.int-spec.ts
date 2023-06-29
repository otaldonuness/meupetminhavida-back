import { Test } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { PrismaService } from "../../../src/config/prisma/prisma.service";
import { UsersService } from "../../../src/modules/users/users.service";
import { CreateUserDto } from "../../../src/modules/users/dto";
import { UsersRole } from "@prisma/client";
import { UnauthorizedException } from "@nestjs/common";

describe("UsersService Integraton", () => {
  let prisma: PrismaService;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
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
        location: {
          city: "Test of December",
          state: "TD",
          zip: "12345678",
        },
      };

      const user = await usersService.create(createUserDto);
      expect(user.email).toBe(createUserDto.email);
      expect(user.hashedPassword).toBeUndefined();
      expect(user.hashedRefreshToken).toBeUndefined();
    });

    it("given already created user when create user then should not create user and  throw error", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@test.com",
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.REGULAR,
        location: {
          city: "Test of December",
          state: "TD",
          zip: "12345678",
        },
      };
      await usersService.create(createUserDto);

      await usersService
        .create(createUserDto)
        .then((tokens) => expect(tokens).toBeUndefined())
        .catch((err) => {
          expect(err.status).toBe(401);
          expect(err).toBeInstanceOf(UnauthorizedException);
        });
    });
  });
});
