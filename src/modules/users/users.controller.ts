import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetCurrentUser } from "../../shared/decorators";

@ApiBearerAuth()
@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async getMe(@GetCurrentUser("sub") userId: string) {
    const user = await this.usersService.findOneById(userId);

    return this.usersService.removeSecrets(user);
  }
}
