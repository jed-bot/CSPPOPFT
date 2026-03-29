import { Module} from "@nestjs/common";
import { OfficerAccountController } from "src/controller/officer.account.controller";
import { OfficerAccountService } from "src/service/officer.account.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { officeraccount } from "src/entities/officeraccount.entity";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { officerprofile } from "src/entities/officerprofile.entity";
import { officerbmi } from "src/entities/officerbmi.entity";
import { OfficerProfileService } from "src/service/officer.profile.service";
import { OfficerProfileController } from "src/controller/officer.profile.controller";
import { officer1minpushup } from "src/entities/officer1minpushup.entity";
import { officersitup1min } from "src/entities/officersitup1min.entity";
import { OfficerPftTestService } from "src/service/officer.pft.test.service";
import { officer300msprint } from "src/entities/officer300msprint.entity";
import { OfficerSprintTestController } from "src/controller/officer.sprint.test.controller";
import { OfficerSprintTestService } from "../service/sprinttest.service";
import { walktest } from "src/entities/officer.walk.test.entity";
import { OfficerWalkTestService } from "src/service/walk.test.service";
import { OfficerWalktestController } from "src/controller/officer.walk.test.controller";
@Module({
    imports:[

        ConfigModule.forRoot({isGlobal:true}),
        TypeOrmModule.forFeature([officeraccount,officerprofile,officerbmi,officer1minpushup,officersitup1min,officer300msprint,walktest]),
        JwtModule.register({
            secret:process.env.JWT_SECRET,
            signOptions:{expiresIn:'1h'},
        })
    ],
    controllers:[
        OfficerAccountController,
        OfficerProfileController,
        OfficerSprintTestController,
        OfficerWalktestController
    ],
    providers:[
        OfficerAccountService,
        OfficerProfileService,
        OfficerPftTestService,
        OfficerSprintTestService,
        OfficerWalkTestService,
        JwtStrategy
    ]
})

export class OfficerAccountModule{}