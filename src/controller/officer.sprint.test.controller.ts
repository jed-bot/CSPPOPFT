import {Controller,Get,Post,Body,UseGuards,Put,Request,Param, Delete} from '@nestjs/common';
import { OfficerAccountService } from 'src/service/officer.account.service';
import { AuthGuard } from '@nestjs/passport';
import { Create300mTestDto} from 'src/300m_test_Dto/create.300.test.dto';
import { OfficerSprintTestService } from '../service/sprinttest.service';
import { Update300mTestDto } from 'src/300m_test_Dto/update.300.test.dto';
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
    @UseGuards(AuthGuard('jwt'))
    @Get('auth/officer/get_sprint_record')
    async getofficersprintrecord(@Request()req){
        return this.OfficerSprintTestService.getofficersprintrecords(req.user.sub,req.user);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('auth/officer/update_sprint_record/:id')
    async updateOfficerSprintRecord(@Request()req,@Param('id') id:number,@Body()Dto:Update300mTestDto){
        return this.OfficerSprintTestService.updateofficersprintrecord(Dto,req.user.sub,id,req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('auth/officer/delete_sprint_record/:id')
    async deleteOfficerSprintRecord(@Request()req,@Param('id') id:number){
        return this.OfficerSprintTestService.deleteofficersprintrecord(id,req.user,req.user.sub);
    }
}