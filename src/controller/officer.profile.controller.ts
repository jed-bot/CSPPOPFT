import {Controller,Get,Post,Body,UseGuards,Put,Request} from '@nestjs/common';
import { OfficerAccountModule} from 'src/modules/officer.account.module';
import { OfficerAccountService } from 'src/service/officer.account.service';
import { LoginOfficerAccountDto } from 'src/officer_account_dto/login.officer.account';
import { CreateOfficerAccountDto } from 'src/officer_account_dto/create.officer.account.dto';
import { AuthGuard } from '@nestjs/passport';
import { officersitup1min} from 'src/entities/officersitup1min.entity';
import { CreateSitUpDto } from 'src/officer_situp_1min/create.officer.1minsitup.dto';
import { OfficerPftTestService } from 'src/service/officer.pft.test.service';
@Controller()
export class OfficerProfileController{
    constructor(private readonly officerAccountService: OfficerAccountService,
        private readonly OfficerPftTestService: OfficerPftTestService,
    ){}
    
    @UseGuards(AuthGuard('jwt'))
    @Post('auth/officer/create_situp')
    async createOfficerSitup(@Request()req,@Body()createSitUpDto:CreateSitUpDto){
        return this.OfficerPftTestService.createofficer1minstup(createSitUpDto,req.user.sub,req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('auth/officer/situp_record')
    async getOfficerSitupRecord(@Request()req){
        return this.OfficerPftTestService.getofficersituprecords(req.user.sub,req.user);
    }
}