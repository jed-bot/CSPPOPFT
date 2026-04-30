import {Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OfficerPerformanceSummary } from 'src/entities/officer.grade.summary.entity';
import { administrator } from 'src/entities/administrator.entity';
import { ConflictException,NotFoundException} from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
    export class OfficerSummaryService{
        constructor(
            @InjectRepository(administrator)
            private readonly adminRepository: Repository<administrator>,

            @InjectRepository(OfficerPerformanceSummary)
            private readonly SummaryRepository: Repository<OfficerPerformanceSummary>
        ){}


        async getallsummary(adminId:number,user:any):Promise<OfficerPerformanceSummary[]>{
            if(user?.sub !== adminId){
                throw new UnauthorizedException('Unauthorized Access');
            }

            const adminAccount = await this.adminRepository.findOne({
                where:{id:adminId}
            })

            if(!adminAccount){
                throw new NotFoundException('Administrator Account Not Found');
            }
            const record = await this.SummaryRepository.find()

            return record;
        }

        async getsummarybyid(adminId:number,recordId:number,user:any):Promise<OfficerPerformanceSummary>{
            if(user?.sub !== adminId){
                throw new UnauthorizedException('Unauthorized Access')
            }

            const adminAccount = await this.adminRepository.findOne({
                where:{id:adminId}
            })

            if(!adminAccount){
                throw new NotFoundException('Administrator Account not Found');
            }

            const record = await this.SummaryRepository.findOne({
                where:{officer_id:recordId}
            })

            if(!record){
                throw new NotFoundException('Record Not Found');
            }
            return record;
        }
    }