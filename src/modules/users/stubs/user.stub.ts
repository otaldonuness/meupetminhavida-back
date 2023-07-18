import { Users, UsersRole } from "@prisma/client";

export const userStub = (): Users => {
  const DEFAULT_HASHED_PASSWORD = process.env.DEFAULT_HASHED_PASSWORD;

  return {
    id: "test-uuid",
    role: UsersRole.REGULAR,
    firstName: "Test",
    lastName: "Test",
    email: "test@test.com",
    hashedRefreshToken: "test-hashed-refresh-token",
    hashedPassword: DEFAULT_HASHED_PASSWORD,
    mobileNumber: "12345678901",
    description: "Test description",
    locationId: "location-test-uuid",
    createdAt: new Date("2023-06-30 20:58:04"),
    updatedAt: new Date("2023-06-30 20:58:04"),
    bannedAt: new Date("2023-06-30 20:58:04"),
  };
};
