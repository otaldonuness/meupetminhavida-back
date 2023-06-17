import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/guards';
import { GetUser } from 'src/shared/decorators';
import { Users } from '@prisma/client';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get('me')
  getCurrentUser(@GetUser() user: Users) {
    return user;
  }
}
