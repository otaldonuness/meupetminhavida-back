import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "../../../src/modules/users/users.controller";
import { UsersService } from "../../../src/modules/users/users.service";

describe("UsersController", () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
