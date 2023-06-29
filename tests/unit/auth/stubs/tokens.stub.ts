import { TokenInfo } from "../../../../src/modules/auth/types";

export const tokensStub = (): TokenInfo => {
  return {
    accessToken: "stub-access-token",
    refreshToken: "stub-refresh-token",
    accessType: "Bearer",
  };
};
