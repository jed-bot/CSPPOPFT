import {Controller,Get,Post,Body,UseGuards,Put,Request,Param, Delete} from '@nestjs/common';
import { OfficerAccountModule} from 'src/modules/officer.account.module';
import { OfficerAccountService } from 'src/service/officer.account.service';
import { LoginOfficerAccountDto } from 'src/officer_account_dto/login.officer.account';
import { CreateOfficerAccountDto } from 'src/officer_account_dto/create.officer.account.dto';
import { AuthGuard } from '@nestjs/passport';
import { officersitup1min} from 'src/entities/officersitup1min.entity';
import { CreateSitUpDto } from 'src/officer_situp_1min/create.officer.1minsitup.dto';
import { OfficerSitupService } from 'src/service/officer.situp.service';
import { UpdateSitUpDto } from 'src/officer_situp_1min/update.officer.1minsitup.dto';
@Controller('auth/officer')
export class OfficerSitupController{
    constructor(
        private readonly officerAccountService: OfficerAccountService,
        private readonly OfficerSitupService: OfficerSitupService,
    ){}
    
    @UseGuards(AuthGuard('jwt'))
    @Post('/create_situp')
    async createOfficerSitup(@Request()req,@Body()createSitUpDto:CreateSitUpDto){
        return this.OfficerSitupService.createofficer1minstup(createSitUpDto,req.user.sub,req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/situp_record')
    async getOfficerSitupRecord(@Request()req){
        return this.OfficerSitupService.getofficersituprecords(req.user.sub,req.user);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('/update_situp/:id')
    async updateOfficerSitUpRecord(@Request()req,@Param('id') id:number,@Body()updatesitupDto:UpdateSitUpDto){
        return this.OfficerSitupService.updateOfficersitupRecord(updatesitupDto,id,req.user.sub,req.user)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/delete_situp/:id')
    async deleteOfficerSitupRecord(@Request()req,@Param('id') id:number){
        return this.OfficerSitupService.deletsitUprecord(id,req.user.sub,req.user)
    }
}