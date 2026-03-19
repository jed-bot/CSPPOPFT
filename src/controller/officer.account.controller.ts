import {Controller,Get,Post,Body,UseGuards,Put,Request} from '@nestjs/common';
import { OfficerAccountModule} from 'src/modules/officer.account.module';
import { OfficerAccountService } from 'src/service/officer.account.service';
import { LoginOfficerAccountDto } from 'src/officer_account_dto/login.officer.account';
import { CreateOfficerAccountDto } from 'src/officer_account_dto/create.officer.account.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class OfficerAccountController{
    constructor(private readonly officerAccountService: OfficerAccountService){}

    @Post('auth/officer/signup')
    async createOfficerAccount(@Body()createOfficerAccountDto:CreateOfficerAccountDto){
        return this.officerAccountService.createOfficerAccount(createOfficerAccountDto);
    }

    @Post('auth/officer/login')
    async loginOfficerAccount(@Body()loginOfficerAccountDto:LoginOfficerAccountDto){
        return this.officerAccountService.loginOfficerAccount(loginOfficerAccountDto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('auth/officer/info')
    async getOfficerAccountInfo(@Request()req){
        return this.officerAccountService.getOfficerAccountInfo(req.user.sub,req.user)
    }
}