import {Controller,Get,Post,Body,UseGuards,Put,Request} from '@nestjs/common';
import { OfficerAccountModule} from 'src/modules/officer.account.module';
import { OfficerAccountService } from 'src/service/officer.account.service';
import { LoginOfficerAccountDto } from 'src/officer_account_dto/login.officer.account';
import { CreateOfficerAccountDto } from 'src/officer_account_dto/create.officer.account.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class OfficerProfileController{
    constructor(private readonly officerAccountService: OfficerAccountService){}

    
}