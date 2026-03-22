import {Controller,Get,Post,Body,UseGuards,Put,Request} from '@nestjs/common';
import { OfficerAccountModule} from 'src/modules/officer.account.module';
import { OfficerAccountService } from 'src/service/officer.account.service';
import { LoginOfficerAccountDto } from 'src/officer_account_dto/login.officer.account';
import { CreateOfficerAccountDto } from 'src/officer_account_dto/create.officer.account.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateOfficerProfileDto } from 'src/officer_profile_dto/create.officer.profile.dto';
import { UpdateOfficerProfileDto } from 'src/officer_profile_dto/update.officer.profile.dto';

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
    @Post('auth/officer/create_profile')
    async createOfficerProfile(@Request()req,@Body()createOfficerProfileDto:CreateOfficerProfileDto){
        return this.officerAccountService.createOfficerProfile(createOfficerProfileDto,req.user.sub,req.user);
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
}