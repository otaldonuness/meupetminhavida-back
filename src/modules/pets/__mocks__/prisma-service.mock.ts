import { petStub } from '../stubs'

export const PrismaMock = jest.fn().mockReturnValue({
    pets: {
        create: jest.fn().mockResolvedValue(petStub()),
        findMany: jest.fn().mockResolvedValue([petStub()]),
        findUniqueOrThrow: jest.fn().mockResolvedValue(petStub())
    }
})
