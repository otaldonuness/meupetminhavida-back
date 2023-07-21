import { jwtTokenStub } from "../stubs"

export const JwtServiceMock = jest.fn().mockReturnValue({
  signAsync: jest.fn().mockResolvedValue(jwtTokenStub())
})
