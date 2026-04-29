import { Module} from "@nestjs/common";
import { OfficerProfileController } from "src/controller/officer.profile.contoller";
import { OfficerAccountService } from "src/service/officer.account.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { officeraccount } from "src/entities/officeraccount.entity";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { OfficerProfileService } from "src/service/officer.profile.service";
import { officerbmi } from "src/entities/officerbmi.entity";
import { OfficerAccountController } from "src/controller/officer.account.controller";
import { officer1minpushup } from "src/entities/officer1minpushup.entity";
import { officer300msprint } from "src/entities/officer300msprint.entity";
import { OfficerSprintTestController } from "src/controller/officer.sprint.test.controller";
import { OfficerSprintTestService } from "../service/sprinttest.service";
import { walktest } from "src/entities/officer.walk.test.entity";
import { OfficerWalkTestService } from "src/service/walk.test.service";
import { OfficerWalktestController } from "src/controller/officer.walk.test.controller";
import { officerprofile } from "src/entities/officerprofile.entity";
import { administrator } from "src/entities/administrator.entity";
import { OfficerBmiController } from "src/controller/officer.bmi.controller";
import { OfficerBmiService } from "src/service/officer.bmi.service";
import { OfficerPushUpService } from "src/service/officer.pushup.service";
import { OfficerPushupController } from "src/controller/officer.pushup.controller";
import { OfficerSitupController } from "src/controller/officer.situpcontroller";
import { OfficerSitupService } from "src/service/officer.situp.service";

@Module({
    imports:[

        ConfigModule.forRoot({isGlobal:true}),
        TypeOrmModule.forFeature([administrator,officeraccount,officerbmi,officer1minpushup,officer1minpushup,officer300msprint,walktest,officerprofile]),
        PassportModule.register({defaultStrategy:'jwt'}),
        JwtModule.register({
            secret:process.env.JWT_SECRET,
            signOptions:{expiresIn:'1h'},
        })

    ],
    controllers:[
        OfficerProfileController,
        OfficerAccountController,
        OfficerSprintTestController,
        OfficerWalktestController,
        OfficerBmiController,
        OfficerPushupController,
        OfficerSitupController

    ],
    providers:[
        OfficerAccountService,
        OfficerProfileService,
        OfficerSprintTestService,
        OfficerWalkTestService,
        OfficerBmiService,
        OfficerPushUpService,
        OfficerSitupService,
        JwtStrategy
    ]
})

export class OfficerProfileModule{}