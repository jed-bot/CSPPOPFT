import {Controller,Get,Post,Body,UseGuards,Put,Request,Delete,Param, Req} from '@nestjs/common';
import { CreateOfficer1minPushupDto } from 'src/officer1min_push_dto/create.1min.psuhup.dto';
import { UpdateOfficer1minPushupDto } from 'src/officer1min_push_dto/update.1min.pushup';
import { AuthGuard } from '@nestjs/passport';
import { OfficerPushUpService } from 'src/service/officer.pushup.service';

@Controller('auth/officer')
export class OfficerPushupController{
    constructor(
        private readonly officerPushupservice:OfficerPushUpService,
    ){}

     @UseGuards(AuthGuard('jwt'))
    @Post('/create_pushup_record')
    async createOfficerPushupRecord(@Request()req,@Body()createOfficer1minPushupDto:CreateOfficer1minPushupDto){
        return this.officerPushupservice.createOfficer1minPushup(createOfficer1minPushupDto,req.user.sub,req.user)
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Get('/pushup_record')
    async getOfficerPushupRecord(@Request()req){
        return this.officerPushupservice.getOfficer1minPushup(req.user.sub,req.user)
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('/update_officer_pushup_record/:id')  
    async updateOfficerPushupRecord(@Request() req,@Param('id') id: number,@Body() updateOfficer1minPushupDto: UpdateOfficer1minPushupDto) {
    return this.officerPushupservice.updateOfficer1minPushup( id,updateOfficer1minPushupDto,req.user.sub);
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete('/delete_officer_pushup_record/:id')
    async deleteOfficerPushupRecord(@Request() req, @Param('id') id: number) {
        return this.officerPushupservice.deletepushUp(id, req.user);  // Pass full user object
    }

}