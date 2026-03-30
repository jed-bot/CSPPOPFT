import { Module } from "@nestjs/common";
import { AdminController } from "../controller/admin.controller";
import { AdminService } from "../service/admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { administrator } from "src/entities/administrator.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { OfficerAccountService } from "src/service/officer.account.service";
import { OfficerAccountController } from "src/controller/officer.account.controller";
import { officeraccount } from "src/entities/officeraccount.entity";
import { OfficerProfileService } from "src/service/officer.profile.service";
import { OfficerProfileController } from "src/controller/officer.profile.controller";
import { officerprofile } from "src/entities/officerprofile.entity";
import { officerbmi } from "src/entities/officerbmi.entity";
import { officer1minpushup } from "src/entities/officer1minpushup.entity";
import { officersitup1min } from "src/entities/officersitup1min.entity";
import { OfficerPftTestService } from "src/service/officer.pft.test.service";
import { OfficerSprintTestService } from "../service/sprinttest.service";
import { OfficerSprintTestController } from "src/controller/officer.sprint.test.controller";
import { officer300msprint } from "src/entities/officer300msprint.entity"; 
import { walktest } from "src/entities/officer.walk.test.entity";
import { OfficerWalkTestService } from "src/service/walk.test.service";
import { OfficerWalktestController } from "src/controller/officer.walk.test.controller";
@Module({

    imports:[
        ConfigModule.forRoot({isGlobal:true}),
        TypeOrmModule.forFeature([administrator,officeraccount,officerprofile,officerbmi,officer1minpushup,officersitup1min,officer300msprint,walktest]),
        JwtModule.registerAsync({  // ← Change to registerAsync
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1h' },
            }),
        }),
    ],
    controllers:[
        AdminController,
        OfficerAccountController,
        OfficerProfileController,
        OfficerSprintTestController,
        OfficerWalktestController
    ],
    providers:[
        AdminService,
        OfficerAccountService,
        OfficerProfileService,
        OfficerPftTestService,
        OfficerSprintTestService,
        OfficerWalkTestService,
        JwtStrategy
    ],
})

export class AdminModule{}