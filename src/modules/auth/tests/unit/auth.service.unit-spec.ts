import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";
import { JwtServiceMock } from "../../__mocks__/jwt-service.mock";
import { UsersService } from "../../../users/users.service";
import { AuthService } from "../../auth.service";
import { ConfigServiceMock } from "../../__mocks__/config-service.mock";
import { SignInAuthDto } from "../../dto";
import { envVariablesStub, tokensStub } from "../../stubs";
import { JwtPayload } from "../../types";
import { UsersRole } from "@prisma/client";
import { userStub } from "../../../users/stubs";

jest.mock("../../../users/users.service");

describe("AuthService Unit", () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: ConfigService,
          useClass: ConfigServiceMock
        },
        {
          provide: JwtService,
          useClass: JwtServiceMock
        }
      ]
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signIn()", () => {
    it("when signIn is called then it should call usersService", async () => {
      const signInDto: SignInAuthDto = {
        email: "test@test.com",
        password: "Senh@teste123!"
      };
      const tokens = await authService.signIn(signInDto);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(signInDto.email);
      expect(usersService.updateHashedRefreshToken).toHaveBeenCalledWith(
        userStub().id,
        tokensStub().refreshToken
      );
      expect(tokens).toEqual(tokensStub());
    });

    it("given wrong password when signIn is called then it should call usersService and throws unauthorized", async () => {
      const signInDto: SignInAuthDto = {
        email: "test@test.com",
        password: "wrong"
      };

      await authService
        .signIn(signInDto)
        .then((tokens) => expect(tokens).toBeUndefined())
        .catch((err) => {
          expect(err.status).toBe(401);
          expect(err).toBeInstanceOf(UnauthorizedException);
        });
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(signInDto.email);
    });
  });

  describe("signTokens()", () => {
    it("when signTokens is called then it should call jwtService", async () => {
      const tokenPayload: JwtPayload = {
        sub: "random-uuid",
        email: "test@test.com",
        role: UsersRole.REGULAR
      };
      const accessTokenOptions = {
        secret: envVariablesStub()["ACCESS_TOKEN_SECRET"],
        expiresIn: envVariablesStub()["ACCESS_TOKEN_EXPIRES"]
      };
      const refreshTokenOptions = {
        secret: envVariablesStub()["REFRESH_TOKEN_SECRET"],
        expiresIn: envVariablesStub()["REFRESH_TOKEN_EXPIRES"]
      };

      const tokens = await authService.signTokens(tokenPayload);
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(
        1,
        tokenPayload,
        accessTokenOptions
      );
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        tokenPayload,
        refreshTokenOptions
      );
      expect(tokens).toEqual(tokensStub());
    });
  });
});
