import { jwtTokenStub } from "../../../../tests/unit/auth/stubs";

export const JwtService = jest.fn().mockReturnValue({
  signAsync: jest.fn().mockResolvedValue(jwtTokenStub()),
});
