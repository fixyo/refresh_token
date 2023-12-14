import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser);
    console.log(user);
    const access_token = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
      },
      { expiresIn: '1m' },
    );
    const refresh_token = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '7d' },
    );
    return {
      access_token,
      refresh_token,
    };
  }

  @Get('refresh')
  async refresh(@Query('refresh_token') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId);
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
        },
        { expiresIn: '1m' },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        { expiresIn: '7d' },
      );

      return {
        refresh_token,
        access_token,
      };
    } catch (error) {
      throw new UnauthorizedException('token expires, need login');
    }
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
