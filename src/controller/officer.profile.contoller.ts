import {Controller,Get,Post,Body,UseGuards,Put,Request,Delete,Param, Req} from '@nestjs/common';
import { OfficerProfileService } from 'src/service/officer.profile.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateOfficerProfileDto } from 'src/officer_profile_dto/create.officer.profile.dto';
import { UpdateOfficerProfileDto } from 'src/officer_profile_dto/update.officer.profile.dto';
import { DeleteOfficerProfileDto } from 'src/officer_profile_dto/delete.officer.profile.dto';

@Controller('auth/officer')
export class OfficerProfileController{
    constructor(
        private readonly officerProfileService:OfficerProfileService,
    ){}


     @UseGuards(AuthGuard('jwt'))
    @Post('/create_profile')
    async createOfficerProfile(@Request()req,@Body()createOfficerProfileDto:CreateOfficerProfileDto){
        return this.officerProfileService.createofficerProfile(createOfficerProfileDto,req.user.sub,req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/profile')
    async getOfficerProfile(@Request()req){
        return this.officerProfileService.getOfficerProfile(req.user.sub,req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/update_profile')
    async udpateOfficerProfile(@Request()req, @Body()UpdateOfficerProfileDto:UpdateOfficerProfileDto){
        return this.officerProfileService.UpdateOfficerProfile(req.user.sub,UpdateOfficerProfileDto,req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/delete_profile')
    async DeleteOfficerProfileDto(@Request()req,@Body()DeleteOfficerProfileDto:DeleteOfficerProfileDto){
        return this.officerProfileService.deleteOfficerProfile(DeleteOfficerProfileDto,req.user.sub,req.user)
    }
}