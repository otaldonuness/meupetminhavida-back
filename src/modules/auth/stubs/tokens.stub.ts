import { TokenInfo } from "../../../../src/modules/auth/types";
import { jwtTokenStub } from "./jwt-token.stub";

export const tokensStub = (): TokenInfo => {
  return {
    accessToken: jwtTokenStub(),
    refreshToken: jwtTokenStub(),
    accessType: "Bearer"
  };
};
