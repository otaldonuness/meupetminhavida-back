import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { UsersService } from "./users.service";
import { GetCurrentUser } from "../../shared/decorators";
import { UserResponseDto } from "./dto";

@ApiBearerAuth()
@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async getMe(@GetCurrentUser("sub") userId: string) {
    const user = await this.usersService.findOneById(userId);
    return plainToInstance(UserResponseDto, user);
  }
}
