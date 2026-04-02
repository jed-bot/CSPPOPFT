// src/auth/admin-auth-key.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminAuthKeyGuard implements CanActivate {
    constructor(private configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const adminKey = request.headers['x-admin-key'] || request.headers['X-Admin-Key'];
        const validKey = this.configService.get<string>('ADMIN_AUTH_KEY');
        if (!adminKey || adminKey !== validKey) {
            throw new UnauthorizedException('Valid admin auth key required');
        }
        
        return true;
    }
}