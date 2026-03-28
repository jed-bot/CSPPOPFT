import { Module} from "@nestjs/common";
import { OfficerProfileController } from "src/controller/officer.profile.controller";
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
import { OfficerPftTestService } from "src/service/officer.pft.test.service";
import { officer300msprint } from "src/entities/officer300msprint.entity";
import { OfficerSprintTestController } from "src/controller/officer.sprint.test.controller";
import { OfficerSprintTestService } from "../service/sprinttest.service";

@Module({
    imports:[

        ConfigModule.forRoot({isGlobal:true}),
        TypeOrmModule.forFeature([officeraccount,officerbmi,officer1minpushup,officer1minpushup,officer300msprint]),
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
    ],
    providers:[
        OfficerAccountService,
        OfficerProfileService,
        OfficerPftTestService,
        OfficerSprintTestService,
        JwtStrategy
    ]
})

export class OfficerProfileModule{}