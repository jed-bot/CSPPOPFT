import {Controller,Get,Post,Body,UseGuards,Put,Request,Delete,Param, Req} from '@nestjs/common';
import { OfficerAccountModule} from 'src/modules/officer.account.module';
import { OfficerAccountService } from 'src/service/officer.account.service';
import { LoginOfficerAccountDto } from 'src/officer_account_dto/login.officer.account';
import { CreateOfficerAccountDto } from 'src/officer_account_dto/create.officer.account.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateOfficerProfileDto } from 'src/officer_profile_dto/create.officer.profile.dto';
import { UpdateOfficerProfileDto } from 'src/officer_profile_dto/update.officer.profile.dto';
import { DeleteOfficerProfileDto } from 'src/officer_profile_dto/delete.officer.profile.dto';
import { DeleteOfficerAccountDto } from 'src/officer_account_dto/delete.officer.account.dto';
import { UpdateOfficerAccountInfoDto } from 'src/officer_account_dto/update.officer.account.info';
import { ForgotOfficerAccountDto } from 'src/officer_account_dto/forgot.officer.account';
import { CreateOfficerBmiDto,createofficerbmibyother } from 'src/officer_bmi_dto/create.officer.bmi.dto';
import { OfficerProfileService } from 'src/service/officer.profile.service';
import { UpdateOfficerBmiDto } from 'src/officer_bmi_dto/update.officer.bmi.dto';
import { CreateOfficer1minPushupDto } from 'src/officer1min_push_dto/create.1min.psuhup.dto';
import { UpdateOfficer1minPushupDto } from 'src/officer1min_push_dto/update.1min.pushup';

@Controller('auth/officer')
export class OfficerAccountController{
    constructor(
        private readonly officerAccountService: OfficerAccountService,
        private readonly officerProfileService:OfficerProfileService
    )
    {}

    @Post('/signup')
    async createOfficerAccount(@Body()createOfficerAccountDto:CreateOfficerAccountDto){
        return this.officerAccountService.createOfficerAccount(createOfficerAccountDto);
    }

    @Post('/login')
    async loginOfficerAccount(@Body()loginOfficerAccountDto:LoginOfficerAccountDto){
        return this.officerAccountService.loginOfficerAccount(loginOfficerAccountDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/info')
    async getOfficerAccountInfo(@Request()req){
        return this.officerAccountService.getOfficerAccountInfo(req.user.sub,req.user);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('/reset_password')
    async resetOfficerPassword(@Request()req,@Body()forgotOfficerAccountDto:ForgotOfficerAccountDto){
        return this.officerAccountService.forgotOfficerPassword(forgotOfficerAccountDto,req.user.sub);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('/update_account')
    async updateOfficerAccountInfo(@Request()req,@Body()updateOfficerProfileInfoDto:UpdateOfficerAccountInfoDto){
        return this.officerAccountService.updateOfficerAccount(updateOfficerProfileInfoDto,req.user.sub,req.user);
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete('/delete_account')
    async deleteOfficerAccount(@Request()req,@Body()DeleteOfficerAccountDto:DeleteOfficerAccountDto){
        return this.officerAccountService.deletOfficerAccount(DeleteOfficerAccountDto,req.user.sub,req.user);
    }

}