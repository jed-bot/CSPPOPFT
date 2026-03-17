import { Module } from "@nestjs/common";
import { AdminController } from "../controller/admin.controller";
import { AdminService } from "../service/admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { administrator } from "src/entities/administrator.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "src/auth/jwt.strategy";

@Module({

    imports:[
        ConfigModule.forRoot({isGlobal:true}),
        TypeOrmModule.forFeature([administrator]),
        PassportModule.register({defaultStrategy:'jwt'}),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions:{expiresIn:'1h'},
        })
    ],
    controllers:[
        AdminController
    ],
    providers:[
        AdminService,
        JwtStrategy
    ],
})

export class AdminModule{}