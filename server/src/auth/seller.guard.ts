import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../users/user-role.enum';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class SellerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const user: JwtPayload = context.switchToHttp().getRequest().user;

    return user?.role == UserRole.SELLER;
  }
}
