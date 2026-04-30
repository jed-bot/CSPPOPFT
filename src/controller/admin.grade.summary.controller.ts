import { Controller, Get, Param, ParseIntPipe,Post,Body,ValidationPipe,Put ,UseGuards,Patch,Request,Delete, Req, ParseArrayPipe} from '@nestjs/common';
import { OfficerSummaryService } from 'src/service/officer.summary.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/admin')
    export class OfficerSummaryController{

        constructor(
            private readonly OfficerSummaryService:OfficerSummaryService,
        ){}

        @UseGuards(AuthGuard('jwt'))
        @Get('/summary')
        async getallsummaryrecords(@Request()req){
            return this.OfficerSummaryService.getallsummary(req.user.sub,req.user)
        }

        @UseGuards(AuthGuard('jwt'))
        @Get('/summary/:id')
        async getspecificrecord(@Request()req,@Param('id') id:number){
            return this.OfficerSummaryService.getsummarybyid(req.user.sub,id,req.user)
        }
    }