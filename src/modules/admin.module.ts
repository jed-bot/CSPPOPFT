import { Module } from "@nestjs/common";
import { AdminController } from "../controller/admin.controller";
import { AdminService } from "../service/admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { administrator } from "src/entities/administrator.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { OfficerAccountService } from "src/service/officer.account.service";
import { OfficerAccountController } from "src/controller/officer.account.controller";
import { officeraccount } from "src/entities/officeraccount.entity";
import { OfficerProfileService } from "src/service/officer.profile.service";
import { OfficerProfileController } from "src/controller/officer.profile.controller";
import { officerprofile } from "src/entities/officerprofile.entity";
import { officerbmi } from "src/entities/officerbmi.entity";
import { AuthModule } from "src/auth/auth.module";
import { officer1minpushup } from "src/entities/officer1minpushup.entity";

@Module({

    imports:[
        ConfigModule.forRoot({isGlobal:true}),
        TypeOrmModule.forFeature([administrator,officeraccount,officerprofile,officerbmi,officer1minpushup]),
        JwtModule.register({
            secret:process.env.JWT_SECRET,
            signOptions:{expiresIn:'1h'},
        })
    ],
    controllers:[
        AdminController,
        OfficerAccountController,
        OfficerProfileController
    ],
    providers:[
        AdminService,
        OfficerAccountService,
        OfficerProfileService,
        JwtStrategy
    ],
})

export class AdminModule{}