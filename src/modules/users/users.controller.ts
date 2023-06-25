import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../../shared/guards";
import { GetCurrentUser } from "../../shared/decorators";

@UseGuards(JwtGuard)
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
