import { Users, UsersRole } from "@prisma/client";

export const userStub = (): Users => {
  return {
    id: "test-uuid",
    role: UsersRole.REGULAR,
    firstName: "Test",
    lastName: "Test",
    email: "test@test.com",
    hashedRefreshToken: "test-hashed-refresh-token",
    hashedPassword:
      "$argon2id$v=19$m=65536,t=3,p=4$GQHUYpfebfQi1g3ZfBOIwQ$e5Os9oFxchU54gaV1qEFx9zN4MuRn9Jq3lon9kEnqhc",
    mobileNumber: "12345678901",
    description: "Test description",
    locationId: "location-test-uuid",
    createdAt: new Date("2023-06-30 20:58:04"),
    updatedAt: new Date("2023-06-30 20:58:04"),
    bannedAt: new Date("2023-06-30 20:58:04"),
  };
};
