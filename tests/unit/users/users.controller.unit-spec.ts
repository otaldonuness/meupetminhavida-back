import { Test } from "@nestjs/testing";
import { UsersRole } from "@prisma/client";
import { randomUUID } from "crypto";
import { UsersController } from "../../../src/modules/users/users.controller";
import { UsersService } from "../../../src/modules/users/users.service";
import {
  UpdateUserRoleDto,
  UserResponseDto,
} from "../../../src/modules/users/dto";

jest.mock("../../../src/modules/users/users.service");

describe("UsersController Unit", () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getMe()", () => {
    it("when getMe is called then it should call usersService", async () => {
      const userId = randomUUID();
      const user = await usersController.getMe(userId);
      expect(usersService.findOneById).toHaveBeenCalledWith(userId);
      expect(user).toBeInstanceOf(UserResponseDto);
      expect(user.hashedPassword).toBeUndefined();
      expect(user.hashedRefreshToken).toBeUndefined();
    });
  });

  describe("updateUserRole()", () => {
    it("when updateUserRole is called then it should call usersService", async () => {
      const userId = randomUUID();
      const updateUserRoleDto: UpdateUserRoleDto = {
        newRole: UsersRole.ADMIN,
      };
      const user = await usersController.updateUserRole(
        userId,
        updateUserRoleDto,
      );
      expect(usersService.updateUserRole).toHaveBeenCalledWith(
        userId,
        updateUserRoleDto.newRole,
      );
      expect(user).toBeInstanceOf(UserResponseDto);
      expect(user.hashedPassword).toBeUndefined();
      expect(user.hashedRefreshToken).toBeUndefined();
    });
  });
});
