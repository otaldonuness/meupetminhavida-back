import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as pactum from "pactum";
import { PrismaService } from "../../../src/config/prisma/prisma.service";
import { AppModule } from "../../../src/app.module";
import { SignInAuthDto } from "../../../src/modules/auth/dto";
import { CreateUserDto } from "../../../src/modules/users/dto";
import { HttpStatus } from "@nestjs/common";
import { UsersService } from "../../../src/modules/users/users.service";
import { UsersRole } from "@prisma/client";

describe("/auth", () => {
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

    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });

  afterEach(async () => {
    await prisma.cleanDbInOrder();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be defined", () => {
    expect(usersService).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe("POST /signup", () => {
    const endpoint = "/auth/signup";

    it("given valid input when signup then status 201", () => {
      const signUpDto: CreateUserDto = {
        email: "test@test.com",
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.REGULAR,
        locationId: "49182968-da7c-40d7-8321-0229e9c2cb5e",
      };

      return pactum
        .spec()
        .post(endpoint)
        .withJson(signUpDto)
        .expectStatus(HttpStatus.CREATED)
        .expectJsonLike({
          accessToken: "typeof $V === 'string'",
          refreshToken: "typeof $V === 'string'",
          accessType: "Bearer",
        });
    });

    it("given valid input with already created user when signup then status 401", async () => {
      const signUpDto: CreateUserDto = {
        email: "test@test.com",
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.REGULAR,
        locationId: "49182968-da7c-40d7-8321-0229e9c2cb5e",
      };
      await usersService.create(signUpDto);

      return pactum
        .spec()
        .post(endpoint)
        .withJson(signUpDto)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });

    it("given invalid input when signup then status 400", () => {
      const invalidSignUpDto = {
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        role: UsersRole.REGULAR,
        location: {
          city: "Test of December",
          state: "TD",
          zip: "12345678",
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
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.REGULAR,
        locationId: "49182968-da7c-40d7-8321-0229e9c2cb5e",
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
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({
          accessToken: "typeof $V === 'string'",
          refreshToken: "typeof $V === 'string'",
          accessType: "Bearer",
        });
    });

    it("given invalid input when signin then status 400", () => {
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
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.REGULAR,
        locationId: "49182968-da7c-40d7-8321-0229e9c2cb5e",
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
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.REGULAR,
        locationId: "49182968-da7c-40d7-8321-0229e9c2cb5e",
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

  describe("GET /signout", () => {
    const endpoint = "/auth/signout";
    const signInEndpoint = "/auth/signin";

    it("given authenticated user when signout then status 204", async () => {
      const signUpDto: CreateUserDto = {
        email: "test@test.com",
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.REGULAR,
        locationId: "49182968-da7c-40d7-8321-0229e9c2cb5e",
      };
      await usersService.create(signUpDto);
      const signInDto: SignInAuthDto = {
        email: signUpDto.email,
        password: signUpDto.password,
      };

      const signInResponse = await pactum
        .spec()
        .post(signInEndpoint)
        .withJson(signInDto)
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({
          accessToken: "typeof $V === 'string'",
          refreshToken: "typeof $V === 'string'",
          accessType: "Bearer",
        });
      const { accessToken } = signInResponse.json;

      return pactum
        .spec()
        .get(endpoint)
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.NO_CONTENT);
    });

    it("given not authenticated user when signout then status 401", () => {
      return pactum.spec().get(endpoint).expectStatus(HttpStatus.UNAUTHORIZED);
    });
  });

  describe("GET /refresh", () => {
    const endpoint = "/auth/refresh";
    const signInEndpoint = "/auth/signin";
    const signOutEndpoint = "/auth/signout";

    it("given authenticated user when refresh token then status 200", async () => {
      const signUpDto: CreateUserDto = {
        email: "test@test.com",
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.REGULAR,
        locationId: "49182968-da7c-40d7-8321-0229e9c2cb5e",
      };
      await usersService.create(signUpDto);
      const signInDto: SignInAuthDto = {
        email: signUpDto.email,
        password: signUpDto.password,
      };

      const signInResponse = await pactum
        .spec()
        .post(signInEndpoint)
        .withJson(signInDto)
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({
          accessToken: "typeof $V === 'string'",
          refreshToken: "typeof $V === 'string'",
          accessType: "Bearer",
        });
      const { refreshToken } = signInResponse.json;

      return pactum
        .spec()
        .get(endpoint)
        .withBearerToken(refreshToken)
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({
          accessToken: "typeof $V === 'string'",
          refreshToken: "typeof $V === 'string'",
          accessType: "Bearer",
        });
    });

    it("given signout user when refresh token after signout then status 401", async () => {
      const signUpDto: CreateUserDto = {
        email: "test@test.com",
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.REGULAR,
        locationId: "49182968-da7c-40d7-8321-0229e9c2cb5e",
      };
      await usersService.create(signUpDto);
      const signInDto: SignInAuthDto = {
        email: signUpDto.email,
        password: signUpDto.password,
      };

      const signInResponse = await pactum
        .spec()
        .post(signInEndpoint)
        .withJson(signInDto)
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({
          accessToken: "typeof $V === 'string'",
          refreshToken: "typeof $V === 'string'",
          accessType: "Bearer",
        });
      const {
        accessToken: signInAccessToken,
        refreshToken: signInRefreshToken,
      } = signInResponse.json;

      await pactum
        .spec()
        .get(signOutEndpoint)
        .withBearerToken(signInAccessToken)
        .expectStatus(HttpStatus.NO_CONTENT);

      return pactum
        .spec()
        .get(endpoint)
        .withBearerToken(signInRefreshToken)
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });

    it("given not authenticated user when refresh token then status 401", () => {
      return pactum.spec().get(endpoint).expectStatus(HttpStatus.UNAUTHORIZED);
    });
  });
});
