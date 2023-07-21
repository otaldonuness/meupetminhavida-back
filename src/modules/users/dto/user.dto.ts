import { Exclude, Expose } from "class-transformer";

@Expose()
export class UserResponseDto {
  @Exclude()
  hashedPassword: string;

  @Exclude()
  hashedRefreshToken?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
