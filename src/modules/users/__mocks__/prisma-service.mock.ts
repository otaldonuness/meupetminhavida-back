import { userStub } from "../stubs"

export const PrismaMock = jest.fn().mockReturnValue({
  users: {
    create: jest.fn().mockResolvedValue(userStub()),
    findUnique: jest.fn().mockResolvedValue(userStub()),
    update: jest.fn().mockResolvedValue(userStub()),
    updateMany: jest.fn().mockResolvedValue(userStub())
  }
})
