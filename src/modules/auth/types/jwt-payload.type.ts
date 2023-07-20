export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  refreshToken?: string;
};
