import {Controller,Get,Post,Body,UseGuards,Put,Request,Delete,Param, Req} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateOfficerBmiDto,createofficerbmibyother } from 'src/officer_bmi_dto/create.officer.bmi.dto';
import { UpdateOfficerBmiDto } from 'src/officer_bmi_dto/update.officer.bmi.dto';
import { OfficerBmiService } from 'src/service/officer.bmi.service';

@Controller('auth/officer')
export class OfficerBmiController{
    constructor(
        private readonly officerBmiService:OfficerBmiService,
    ){}

     @UseGuards(AuthGuard('jwt'))
    @Post('/create_bmi')
    async createOfficerBmi(@Request()req,@Body()createdOfficerBmiDto:CreateOfficerBmiDto){
        return this.officerBmiService.createOfficerbmi(createdOfficerBmiDto,req.user.sub,req.user)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/create_other_bmi')
    async createotheofficerbmi(@Request()req,@Body()createDto:createofficerbmibyother,){
        return this.officerBmiService.createofficerbmibyother(createDto,req.user)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/bmi')
    async getOfficerBmi(@Request()req){
        return this.officerBmiService.getOfficerBmi(req.user.sub,req.user)
    }

    // adding a new method 
    @UseGuards(AuthGuard('jwt'))
    @Put('/update_bmi/:id')
    async updateOfficerBmi(@Request() req,@Param('id') id:number,@Body()updateOfficerBmiDto:UpdateOfficerBmiDto ){
        return this.officerBmiService.updateOfficerBmi(id,updateOfficerBmiDto,req.user.sub,req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/delete_bmi/:id')
    async deleteOfficerBmi(@Request()req, @Param('id') id:number ){
        return this.officerBmiService.deleteOfficerBmi(id,req.user.sub,req.user);
    }
}