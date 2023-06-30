import { partialUserStub, userStub } from "../stubs";

export const UsersService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(partialUserStub()),
  findOneById: jest.fn().mockResolvedValue(userStub()),
  findOneByEmail: jest.fn().mockResolvedValue(userStub()),
  updateHashedRefreshToken: jest.fn().mockResolvedValue(Promise.resolve()),
  removeHashedRefreshToken: jest.fn().mockResolvedValue(Promise.resolve()),
});
