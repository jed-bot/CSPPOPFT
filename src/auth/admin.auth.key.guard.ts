// src/auth/admin-auth-key.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminAuthKeyGuard implements CanActivate {
    constructor(private configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        
        console.log('=== GUARD DEBUG ===');
        console.log('All headers:', request.headers);
        console.log('x-admin-key:', request.headers['x-admin-key']);
        console.log('X-Admin-Key:', request.headers['X-Admin-Key']);
        
        const adminKey = request.headers['x-admin-key'] || request.headers['X-Admin-Key'];
        const validKey = this.configService.get<string>('ADMIN_AUTH_KEY');
        
        console.log('Received key:', adminKey);
        console.log('Valid key:', validKey);
        console.log('Keys match?', adminKey === validKey);
        
        if (!adminKey || adminKey !== validKey) {
            throw new UnauthorizedException('Valid admin auth key required');
        }
        
        return true;
    }
}