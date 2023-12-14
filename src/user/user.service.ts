import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async login(loginUser: LoginUserDto) {
    const user = await this.entityManager.findOne(User, {
      where: { username: loginUser.username },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.OK);
    }

    if (user.password !== loginUser.password) {
      throw new HttpException('password incorrect', HttpStatus.OK);
    }

    return user;
  }

  async findUserById(userId: number) {
    const user = await this.entityManager.findOne(User, {
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('login again');
    }

    return user;
  }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
