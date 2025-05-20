import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { FilterUsersDTO, RegisterUserDTO, UserIdDTO, UserPrimaryInfoDTO, UserResponseDTO } from './dto/users.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UsersController {

  constructor(
    private usersService: UsersService
  ) { }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(@Query() usersFilters: FilterUsersDTO): Promise<UserResponseDTO[] | UserPrimaryInfoDTO[]> {
    return await this.usersService.getUsers(usersFilters);
  }


  @Post()
  async registerUser(@Body() userInfo: RegisterUserDTO) {
    return await this.usersService.registrarUsuario(userInfo);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Query() user: UserIdDTO) {
    return await this.usersService.deleteUser(user);
  }
}
