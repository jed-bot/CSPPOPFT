import { Controller, Get, Param, ParseIntPipe,Post,Body,ValidationPipe,Put ,UseGuards,Patch,Request,Delete, Req, ParseArrayPipe} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OfficerSummaryMonthlyService } from 'src/service/officer.summary.monthly.service';

@Controller('auth/admin')
    export class OfficerSummaryController{

        constructor(
            private readonly OfficerSummaryMonthlyService:OfficerSummaryMonthlyService
        ){}

        @UseGuards(AuthGuard('jwt'))
        @Get('/summary')
        async getallsummaryrecords(@Request()req){
               return this.OfficerSummaryMonthlyService.getallmonthlysummary(req.user.sub,req.user);
        }

        @UseGuards(AuthGuard('jwt'))
        @Get('/summary/:id')
        async getspecificrecord(@Request()req,@Param('id') id:number){
             return this.OfficerSummaryMonthlyService.getmonthlysummarybyId(req.user.sub,id,req.user);
        }
    }