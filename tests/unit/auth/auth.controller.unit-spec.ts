import { randomUUID } from "crypto";
import { Test } from "@nestjs/testing";
import { UsersRole } from "@prisma/client";
import { AuthController } from "../../../src/modules/auth/auth.controller";
import { AuthService } from "../../../src/modules/auth/auth.service";
import { SignInAuthDto } from "../../../src/modules/auth/dto";
import { tokensStub } from "../../../src/modules/auth/stubs";
import { CreateUserDto } from "../../../src/modules/users/dto";

jest.mock("../../../src/modules/auth/auth.service");

describe("AuthController Unit", () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signIn()", () => {
    it("when signIn is called then it should call authService", async () => {
      const signInDto: SignInAuthDto = {
        email: "test@test.com",
        password: "test123",
      };
      const tokens = await authController.signIn(signInDto);
      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
      expect(tokens).toEqual(tokensStub());
    });
  });

  describe("signUp()", () => {
    it("given valid input when signUp is called then it should call authService", async () => {
      const signUpDto: CreateUserDto = {
        email: "test@test.com",
        password: "P@sswordTest123!",
        firstName: "Test",
        lastName: "Test",
        mobileNumber: "12345678901",
        role: UsersRole.REGULAR,
        locationId: "49182968-da7c-40d7-8321-0229e9c2cb5e",
      };
      const tokens = await authController.signUp(signUpDto);
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(tokens).toEqual(tokensStub());
    });
  });

  describe("signOut()", () => {
    it("given valid userId when signOut is called then it should call authService", async () => {
      const userId = randomUUID();
      await authController.signOut(userId);
      expect(authService.signOut).toHaveBeenCalledWith(userId);
    });
  });

  describe("refreshTokens()", () => {
    it("given valid userId and refreshToken when signOut is called then it should call authService", async () => {
      const userId = randomUUID();
      const refreshToken = "stub-refresh-token";
      const tokens = await authController.refreshTokens(userId, refreshToken);
      expect(authService.refreshTokens).toHaveBeenCalledWith(
        userId,
        refreshToken
      );
      expect(tokens).toEqual(tokensStub());
    });
  });
});
