import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as pactum from "pactum";
import { PrismaService } from "../../../src/config/prisma/prisma.service";
import { AppModule } from "../../../src/app.module";
import { SignInAuthDto } from "../../../src/modules/auth/dto";
import { CreateUserDto } from "../../../src/modules/users/dto";
import { HttpStatus } from "@nestjs/common";
import { UsersService } from "../../../src/modules/users/users.service";
import { UserRole } from "../../../src/modules/users/enums/user-role.enum";

describe("app e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const PORT = 3001;
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Only DTO fields are allowed.
      })
    );
    await app.init();
    await app.listen(PORT);

    usersService = app.get<UsersService>(UsersService);
    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDbInOrder();

    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });

  afterEach(async () => {
    await prisma.users.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be defined", () => {
    expect(usersService).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe("auth", () => {
    describe("POST /signup", () => {
      const endpoint = "/auth/signup";

      it("given valid input when signup then status 201", async () => {
        const signUpDto: CreateUserDto = {
          email: "test@test.com",
          password: "test123",
          firstName: "Test",
          lastName: "Test",
          mobileNumber: "12345678901",
          role: UserRole.REGULAR,
          location: {
            city: "Test of December",
            state: "TD",
          },
        };

        return pactum
          .spec()
          .post(endpoint)
          .withJson(signUpDto)
          .expectStatus(HttpStatus.CREATED);
      });

      it("given valid input with already created user when signup then status 401", async () => {
        const signUpDto: CreateUserDto = {
          email: "test@test.com",
          password: "test123",
          firstName: "Test",
          lastName: "Test",
          mobileNumber: "12345678901",
          role: UserRole.REGULAR,
          location: {
            city: "Test of December",
            state: "TD",
          },
        };
        await usersService.create(signUpDto);

        return pactum
          .spec()
          .post(endpoint)
          .withJson(signUpDto)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it("given invalid input when signup then status 400", async () => {
        const invalidSignUpDto = {
          password: "test123",
          firstName: "Test",
          lastName: "Test",
          role: UserRole.REGULAR,
          location: {
            city: "Test of December",
            state: "TD",
          },
        };

        return pactum
          .spec()
          .post(endpoint)
          .withJson(invalidSignUpDto)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
    });

    describe("POST /signin", () => {
      const endpoint = "/auth/signin";

      it("given valid input with already created user when signin then status 200", async () => {
        const signUpDto: CreateUserDto = {
          email: "test@test.com",
          password: "test123",
          firstName: "Test",
          lastName: "Test",
          mobileNumber: "12345678901",
          role: UserRole.REGULAR,
          location: {
            city: "Test of December",
            state: "TD",
          },
        };
        await usersService.create(signUpDto);
        const signInDto: SignInAuthDto = {
          email: signUpDto.email,
          password: signUpDto.password,
        };

        return pactum
          .spec()
          .post(endpoint)
          .withJson(signInDto)
          .expectStatus(HttpStatus.OK);
      });

      it("given invalid input when signin then status 400", async () => {
        const invalidSignInDto = {
          email: "test@test.com",
        };

        return pactum
          .spec()
          .post(endpoint)
          .withJson(invalidSignInDto)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it("given invalid password when signin then status 401", async () => {
        const signUpDto: CreateUserDto = {
          email: "test@test.com",
          password: "test123",
          firstName: "Test",
          lastName: "Test",
          mobileNumber: "12345678901",
          role: UserRole.REGULAR,
          location: {
            city: "Test of December",
            state: "TD",
          },
        };
        await usersService.create(signUpDto);
        const signInDto: SignInAuthDto = {
          email: signUpDto.email,
          password: "wrong",
        };

        return pactum
          .spec()
          .post(endpoint)
          .withJson(signInDto)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it("given invalid email when signin then status 401", async () => {
        const signUpDto: CreateUserDto = {
          email: "test@test.com",
          password: "test123",
          firstName: "Test",
          lastName: "Test",
          mobileNumber: "12345678901",
          role: UserRole.REGULAR,
          location: {
            city: "Test of December",
            state: "TD",
          },
        };
        await usersService.create(signUpDto);
        const signInDto: SignInAuthDto = {
          email: "wrong@wrong.com",
          password: signUpDto.password,
        };

        return pactum
          .spec()
          .post(endpoint)
          .withJson(signInDto)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
