import { Module, OnModuleInit } from '@nestjs/common'; // Add OnModuleInit
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin.module';
import * as path from 'path';
import * as fs from 'fs';
import { OfficerAccountModule } from './officer.account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        
        const host = configService.get<string>('DATABASE_HOST');
        const database = configService.get<string>('DATABASE_NAME');
        const portRaw = configService.get<string>('DATABASE_PORT');
        const username = configService.get<string>('DATABASE_USERNAME');
        const password = configService.get<string>('DATABASE_PASSWORD');
        const sslRaw = configService.get<string>('DATABASE_SSL');

        // THIS is where you'll see the ACTUAL values after ConfigModule loads
        console.log('Connecting to the database..')

        if (!password) {
          throw new Error('DATABASE_PASSWORD must be set and be a string. Check your .env file!');
        }

        return {
          type: 'postgres',
          host,
          database,
          port: portRaw ? Number(portRaw) : undefined,
          username,
          password,
          schema:'public',
          entities: [
            __dirname + '/../entities/*.entity{.ts,.js}',
            __dirname + '/**/*.entity{.ts,.js}',
          ],
          synchronize: false,
          ssl: sslRaw === 'require' || sslRaw === 'true' || sslRaw === '1'
            ? { rejectUnauthorized: false }
            : false,
        };
      },
    }),
    AdminModule,
    OfficerAccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  // This runs AFTER the module is initialized and ConfigModule has loaded
  onModuleInit() {
    console.log('Conected successfully to the database..')
  }
}