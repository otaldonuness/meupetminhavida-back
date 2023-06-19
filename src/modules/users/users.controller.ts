import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../../shared/guards';
import { GetUser } from '../../shared/decorators';
import { Users } from '@prisma/client';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getCurrentUser(@GetUser() user: Users) {
    return user;
  }
}
