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

@Controller()
export class OfficerAccountController{
    constructor(private readonly officerAccountService: OfficerAccountService){}

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
    @Delete('auth/officer/delete_account')
    asyncdeleteOfficerAccount(@Request()req,@Body()DeleteOfficerProfileDto:DeleteOfficerProfileDto){
        return this.officerAccountService.deleteOfficerAccount(DeleteOfficerProfileDto,req.user.sub,req.user);
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
    async DeleteOfficerProfileDto(@Request()req,@Body(DeleteOfficerProfileDto)DeleteOfficerProfileDto){
        return this.officerAccountService.deleteOfficerProfile(DeleteOfficerProfileDto,req.user.sub,req.user)
    }
}