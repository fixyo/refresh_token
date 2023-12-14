import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('need login');
    }

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify(token);
      return true;
    } catch (error) {
      throw new UnauthorizedException('token expires');
    }
    return true;
  }
}
