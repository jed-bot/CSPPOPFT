import {Controller,Get,Post,Body,UseGuards,Put,Request,Delete} from '@nestjs/common';
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
import { CreateOfficerBmiDto } from 'src/officer_bmi_dto/create.officer.bmi.dto';
import { OfficerProfileService } from 'src/service/officer.profile.service';
import { UpdateOfficerBmiDto } from 'src/officer_bmi_dto/update.officer.bmi.dto';
import { CreateOfficer1minPushupDto } from 'src/officer1min_push_dto/create.1min.psuhup.dto';

@Controller()
export class OfficerAccountController{
    constructor(
        private readonly officerAccountService: OfficerAccountService,
        private readonly officerProfileService:OfficerProfileService
    )
    {}

    @Post('auth/officer/signup')
    async createOfficerAccount(@Body()createOfficerAccountDto:CreateOfficerAccountDto){
        return this.officerAccountService.createOfficerAccount(createOfficerAccountDto);
    }

    @Post('auth/officer/login')
    async loginOfficerAccount(@Body()loginOfficerAccountDto:LoginOfficerAccountDto){
        return this.officerAccountService.loginOfficerAccount(loginOfficerAccountDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('auth/officer/info')
    async getOfficerAccountInfo(@Request()req){
        return this.officerAccountService.getOfficerAccountInfo(req.user.sub,req.user);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('auth/officer/reset_password')
    async resetOfficerPassword(@Request()req,@Body()forgotOfficerAccountDto:ForgotOfficerAccountDto){
        return this.officerAccountService.forgotOfficerPassword(forgotOfficerAccountDto,req.user.sub);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('auth/officer/update_account')
    async updateOfficerAccountInfo(@Request()req,@Body()updateOfficerProfileInfoDto:UpdateOfficerAccountInfoDto){
        return this.officerAccountService.updateOfficerAccount(updateOfficerProfileInfoDto,req.user.sub,req.user);
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete('auth/officer/delete_account')
    async deleteOfficerAccount(@Request()req,@Body()DeleteOfficerAccountDto:DeleteOfficerAccountDto){
        return this.officerAccountService.deleteOfficerAccount(DeleteOfficerAccountDto,req.user.sub,req.user);
    }
    @UseGuards(AuthGuard('jwt'))
    @Post('auth/officer/create_profile')
    async createOfficerProfile(@Request()req,@Body()createOfficerProfileDto:CreateOfficerProfileDto){
        return this.officerAccountService.createofficerProfile(createOfficerProfileDto,req.user.sub,req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('auth/officer/profile')
    async getOfficerProfile(@Request()req){
        return this.officerAccountService.getOfficerProfile(req.user.sub,req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('auth/officer/update_profile')
    async udpateOfficerProfile(@Request()req, @Body()UpdateOfficerProfileDto:UpdateOfficerProfileDto){
        return this.officerAccountService.UpdateOfficerProfile(req.user.sub,UpdateOfficerProfileDto,req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('auth/officer/delete_profile')
    async DeleteOfficerProfileDto(@Request()req,@Body()DeleteOfficerProfileDto:DeleteOfficerProfileDto){
        return this.officerAccountService.deleteOfficerProfile(DeleteOfficerProfileDto,req.user.sub,req.user)
    }
    @UseGuards(AuthGuard('jwt'))
    @Post('auth/officer/create_bmi')
    async createOfficerBmi(@Request()req,@Body()createdOfficerBmiDto:CreateOfficerBmiDto){
        return this.officerProfileService.createOfficerbmi(createdOfficerBmiDto,req.user.sub,req.user)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('auth/officer/bmi')
    async getOfficerBmi(@Request()req){
        return this.officerProfileService.getOfficerBmi(req.user.sub,req.user)
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('auth/officer/update_bmi')
    async updateOfficerBmi(@Request()req,@Body()updateOfficerBmiDto:UpdateOfficerBmiDto){
        return this.officerProfileService.updateOfficerBmi(req.user.sub,updateOfficerBmiDto,req.user)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('auth/officer/delete_bmi')
    async deleteOfficerBmi(@Request()req){
        return this.officerProfileService.deleteOfficerBmi(req.user.sub,req.user)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('auth/officer/create_pushup_record')
    async createOfficerPushupRecord(@Request()req,@Body()createOfficer1minPushupDto:CreateOfficer1minPushupDto){
        return this.officerProfileService.createOfficer1minPushup(createOfficer1minPushupDto,req.user.sub,req.user)
    }
    
}