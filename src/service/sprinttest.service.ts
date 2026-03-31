import { InjectRepository } from "@nestjs/typeorm";
import { Create300mTestDto } from "src/300m_test_dto/create.300m.test.dto";
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { officerprofile } from 'src/entities/officerprofile.entity';
import { officer300msprint } from "src/entities/officer300msprint.entity";
import { Update300mTestDto } from "src/300m_test_dto/update.300m.test.dto";
import { administrator } from "src/entities/administrator.entity";

@Injectable()
export class OfficerSprintTestService{
    constructor(
        @InjectRepository(officerprofile)
        private readonly officeFileRepository:Repository<officerprofile>,
        @InjectRepository(officer300msprint)
        private readonly officerSprintTestRepository:Repository<officer300msprint>,
        @InjectRepository(administrator)
        private readonly adminRepository:Repository<administrator>,
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

    async getallofficersprintrecord(user:any):Promise<officer300msprint[]>{
        if(!user?.sub){
            throw new UnauthorizedException('Unauthorized Access')
        }
        const admin = await this.adminRepository.findOne({
            where:{id:user.sub}
        })

        if (!admin){
            throw new NotFoundException('Admin does not exsist')
        }

        const sprintRecord = await this.officerSprintTestRepository.find()
        return sprintRecord;
    }

    async getofficersprintrecordbyid(recordId:number,user:any):Promise<officer300msprint>{
        if(!user?.sub){
            throw new UnauthorizedException('Unauthorized Access')
        }

        const admin = await this.adminRepository.findOne({
            where:{id:user.sub}
        })

        const record = await  this.officerSprintTestRepository.findOne({
            where:{id:recordId}
        })

        if(!record){
            throw new NotFoundException('Record Not Found')
        }

        return record;
    }

    async getspecificsprintrecord(recordId:number,accountId:number,user:any):Promise<officer300msprint>{
        if(!user?.sub){
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

    async updateofficersprintrecordadmin(updateDto:Update300mTestDto,recordId:number,user:any):Promise<{message:string}>{
        if(!user?.sub){
            throw new UnauthorizedException('Unauthorized Access')
        }

        const admin = await this.adminRepository.findOne({
            where:{id:user.sub}
        })

        if(!admin){
            throw new NotFoundException('Admin Not found')
        }

        const record = await this.officerSprintTestRepository.findOne({
            where:{id:recordId}
        })

        if(!record){
            throw new NotFoundException('Record not found')
        }

        Object.assign(record,updateDto)
        await this.officerSprintTestRepository.save(record)
        return{
            message:'Updated successfully'
        }
    }

    async updateofficersprintrecord(updateDto:Update300mTestDto,accountId:number,recordId:number,user:any):Promise<{message:string}>{
    
        if(user?.sub !== accountId){
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
        Object.assign(sprintRecord,updateDto);
        await this.officerSprintTestRepository.save(sprintRecord);
        return{
            message:'Updated the sprint record successfully'
        }
    }

    async deletebyAdmin(user:any,recordId:number):Promise<{message:string}>{
         if(!user?.sub){
            throw new UnauthorizedException('Unauthorized Access')
        }

        const admin = await this.adminRepository.findOne({
            where:{id:user.sub}
        })

        if(!admin){
            throw new NotFoundException('Admin Not found')
        }

        const record = await this.officerSprintTestRepository.findOne({
            where:{id:recordId}
        })

        if(!record){
            throw new NotFoundException('Record not found')
        }
        await this.officerSprintTestRepository.delete(recordId)
        return{
            message:'Deleted successfully'
        }

    }

    async deleteofficersprintrecord(recordId:number,user:any,accountId:number):Promise<{message:string}>{
        if(user?.sub !== accountId){
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
        await this.officerSprintTestRepository.delete(recordId)
        return{
            message:'Deleted the Sprint Record successfully'
        }
    }
}