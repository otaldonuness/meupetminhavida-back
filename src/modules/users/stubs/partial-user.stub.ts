import { Users, UsersRole } from "@prisma/client";

export const partialUserStub = (): Partial<Users> => {
  return {
    id: "test-uuid",
    role: UsersRole.REGULAR,
    firstName: "Test",
    lastName: "Test",
    email: "test@test.com",
    mobileNumber: "12345678901",
    locationId: "location-test-uuid",
    createdAt: new Date("2023-06-30 20:58:04"),
    updatedAt: new Date("2023-06-30 20:58:04"),
  };
};
