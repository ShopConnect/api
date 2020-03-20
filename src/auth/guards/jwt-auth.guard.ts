import { AuthGuard } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { User } from '../../database/entities/user.entity';
import { UserToken } from '../../database/entities/user-token.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: Error, user: User, info: RequestInfo, context: ExecutionContext): any {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const authHeader = context.switchToHttp().getRequest<Request>().headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const accessToken = authHeader.split(' ', 2)[1];
    if (user.tokens.every((x: UserToken) => x.token != accessToken || x.isValid == false)) {
      throw new UnauthorizedException();
    }

    return user;
  }
}