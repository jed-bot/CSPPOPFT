import {Controller,Get,Post,Body,UseGuards,Put,Request,Param, Delete} from '@nestjs/common';
import { OfficerAccountService } from 'src/service/officer.account.service';
import { AuthGuard } from '@nestjs/passport';
import { Create2kmTestDto } from 'src/walk_test_dto/create.walk.test.dto';
import { UpdateOfficerWalkDto } from 'src/walk_test_dto/update.officer.walk.test.dto';
import { OfficerWalkTestService } from 'src/service/walk.test.service';

@Controller('auth/officer')
export class OfficerWalktestController{
    constructor(
        private readonly OfficerWalkTestService: OfficerWalkTestService
    ){}Create2kInfoTestDto

    @UseGuards(AuthGuard('jwt'))
    @Post('/create_walktest')
    async createOfficerWalkTest(@Request()req,@Body()CreateDto:Create2kmTestDto){
        return this.OfficerWalkTestService.createofficerwalktest(CreateDto,req.user.sub,req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/get_walktest_record')
    async getOfficerWalkTestRecord(@Request()req){
        return this.OfficerWalkTestService.getofficerwalktestrecords(req.user.sub,req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/update_walkrecord/:id')
    async updateOfficerwalkTestRecod(@Request()req,@Param('id') id:number,@Body() updateDto:UpdateOfficerWalkDto){
        return this.OfficerWalkTestService.updateofficerwalktest(updateDto,req.user.sub,id,req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/delete_walkrecord/:id')
    async deleteOfficerWalkTestRecord(@Request()req,@Param('id') id:number){
        return this.OfficerWalkTestService.deletewalkrecord(id,req.user.sub,req.user);
    }
}