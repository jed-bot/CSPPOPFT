import { InjectRepository } from "@nestjs/typeorm";
import { Create300mTestDto } from "src/300m_test_Dto/create.300.test.dto";
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { officerprofile } from 'src/entities/officerprofile.entity';
import { officer300msprint } from "src/entities/officer300msprint.entity";

@Injectable()
export class OfficerSprintTestService{
    constructor(
        @InjectRepository(officerprofile)
        private readonly officeFileRepository:Repository<officerprofile>,
        @InjectRepository(officer300msprint)
        private readonly officerSprintTestRepository:Repository<officer300msprint>
    ){}

    async createofficersprinttest(createDto:Create300mTestDto,accountId:number,user:any):Promise<{message:string}>{
        if(user?.sub !== accountId){
            throw new UnauthorizedException('Unauthorized Access');
        }
        const profile = await this.officeFileRepository.findOne({
            where:{officer_account_id:accountId}
        })

        if(!profile){
            throw new NotFoundException('Officer Account not found');
        }

        const profileId = profile.id;
        const createsprinttest = this.officerSprintTestRepository.create({
            officer_id:profile.id,
            age: createDto.age,
            gender:createDto.gender,
            minutes:createDto.minutes,
            seconds:createDto.seconds,
            test_date:createDto.test_date,
        })

        await this.officerSprintTestRepository.save(createsprinttest);
        return{
            message:'Added too the record successfully'
        }
    }

    async getofficersprintrecords(accountId:number,user:any):Promise<officer300msprint[]>{
        if(user?.sub !== accountId){
            throw new  UnauthorizedException('Unauthorized Access')
        }
        const profile = await this.officeFileRepository.findOne({
            where:{officer_account_id:accountId}
        })
        if(!profile){
            throw new NotFoundException('Account Not Found')
        }
        const profileId = profile.id;
        const sprintRecord = await this.officerSprintTestRepository.find({
            where:{officer_id:profileId},
            order:{test_date:'DESC'}
        })

        return sprintRecord;
    }

    async getspecificsprintrecord(recordId:number,accountId:number,user:any):Promise<officer300msprint>{
        if(user?.sub){
            throw new UnauthorizedException('Unauthorized Access')
        }
        const profile = await this.officeFileRepository.findOne({
            where:{officer_account_id:accountId}
        })

        if(!profile){
            throw new NotFoundException('Account not found');
        }

        const profileId = profile.id;
        const sprintRecord = await this.officerSprintTestRepository.findOne({
            where:{id:recordId,officer_id:profileId}
        })
        if(!sprintRecord){
            throw new NotFoundException('Record Not Found')
        }
        return sprintRecord;
    }


}