import {Controller,Get,Post,Body,UseGuards,Put,Request,Param, Delete} from '@nestjs/common';
import { OfficerAccountService } from 'src/service/officer.account.service';
import { AuthGuard } from '@nestjs/passport';
import { Create300mTestDto} from 'src/300m_test_Dto/create.300.test.dto';
import { OfficerSprintTestService } from '../service/sprinttest.service';
@Controller()
export class OfficerSprintTestController{
    constructor(
        private readonly OfficerSprintTestService: OfficerSprintTestService
    ){}

    @UseGuards(AuthGuard('jwt'))
    @Post('auth/officer/create_sprint')
    async createOfficerSprint(@Request() req,@Body() create300mTestDto:Create300mTestDto){
        return this.OfficerSprintTestService.createofficersprinttest(create300mTestDto,req.user.sub,req.user);
    }
}