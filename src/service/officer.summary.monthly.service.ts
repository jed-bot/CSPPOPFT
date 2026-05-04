import {Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OfficerPerformanceSummary } from 'src/entities/officer.grade.summary.entity';
import { administrator } from 'src/entities/administrator.entity';
import { ConflictException,NotFoundException} from '@nestjs/common';
import { Repository } from 'typeorm';
import { MonthlySummaryWithOfficer } from 'src/entities/officer.summary.monthly.entity';

@Injectable()
    export class OfficerSummaryMonthlyService{
        constructor(
            @InjectRepository(administrator)
            private readonly adminRepo:Repository<administrator>,

            @InjectRepository(MonthlySummaryWithOfficer)
            private readonly monthlySummaryRepo:Repository<MonthlySummaryWithOfficer>
        ){}
        
        async getallmonthlysummary(adminId:number,user:any):Promise<MonthlySummaryWithOfficer[]>{
            if(user?.sub !== adminId){
                throw new UnauthorizedException('Unauthorized Access');
            }

            const profile = await this.adminRepo.findOne({
                where:{id:adminId}
            });

            if(!profile){
                throw new NotFoundException('Account not found');
            }

            const record  =  await this.monthlySummaryRepo.find();
            return record;
        }

        async getmonthlysummarybyId(adminId:number,recordId:number,user:any):Promise<MonthlySummaryWithOfficer>{
            if(user?.sub !== adminId){
                throw new UnauthorizedException('Unauthoried Access');
            }

            const profile = await this.adminRepo.findOne({
                where:{id:adminId}
            })

            if(!profile){
                throw new NotFoundException('Account not found');
            }
            const record  = await this.monthlySummaryRepo.findOne({
                where: {officer_id:recordId}
            })
            if(!record){
                throw new NotFoundException('Record Not Found');
            }

            return record;
        }
    }