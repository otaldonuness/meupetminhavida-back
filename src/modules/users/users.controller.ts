import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { plainToInstance } from "class-transformer"
import { UsersRole } from "@prisma/client"
import { UsersService } from "./users.service"
import { GetCurrentUser, Roles } from "../../shared/decorators"
import { RolesGuard } from "../../shared/guards"
import { UpdateUserRoleDto, UserResponseDto } from "./dto"

@ApiBearerAuth()
@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async getMe(@GetCurrentUser("sub") userId: string) {
    const user = await this.usersService.findOneById(userId)
    return plainToInstance(UserResponseDto, user)
  }

  @Roles(UsersRole.ADMIN)
  @UseGuards(RolesGuard)
  @Put("update-role/:id")
  async updateUserRole(
    @Param("id") userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ): Promise<UserResponseDto> {
    const user = await this.usersService.updateUserRole(
      userId,
      updateUserRoleDto.newRole
    )
    return plainToInstance(UserResponseDto, user)
  }
}
