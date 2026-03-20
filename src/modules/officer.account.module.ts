import { Module} from "@nestjs/common";
import { OfficerAccountController } from "src/controller/officer.account.controller";
import { OfficerAccountService } from "src/service/officer.account.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { officeraccount } from "src/entities/officeraccount.entity";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { officerprofile } from "src/entities/officerprofile.entity";

@Module({
    imports:[

        ConfigModule.forRoot({isGlobal:true}),
        TypeOrmModule.forFeature([officeraccount,officerprofile]),
        PassportModule.register({defaultStrategy:'jwt'}),
        JwtModule.register({
            secret:process.env.JWT_SECRET,
            signOptions:{expiresIn:'1h'},
        })

    ],
    controllers:[
        OfficerAccountController
    ],
    providers:[
        OfficerAccountService,
        JwtStrategy
    ]
})

export class OfficerAccountModule{}