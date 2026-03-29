import { walktest } from "src/entities/officer.walk.test.entity";
import { Create2kmTestDto } from "src/walk_test_dto/create.walk.test.dto";
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm'; 
import { officerprofile } from 'src/entities/officerprofile.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateOfficerWalkDto } from "src/walk_test_dto/update.officer.walk.test.dto";

@Injectable()
export class OfficerWalkTestService{
    constructor(
        @InjectRepository(officerprofile)
        private readonly officerProfileRepository:Repository<officerprofile>,
        @InjectRepository(walktest)
        private readonly officerWalkTestRepository:Repository<walktest>
    ){}


    async createofficerwalktest(createDto:Create2kmTestDto,accountId:number,user:any):Promise<{message:string}>{
        if(user?.sub !== accountId){
            throw new UnauthorizedException('Unauthorized Access');
        }
        const profile = await this.officerProfileRepository.findOne({
            where:{officer_account_id:accountId}
        })

        if (!profile){
            throw new NotFoundException('Account not found');
        }

        const profileId = profile.id;
        const createTest = this.officerWalkTestRepository.create({
            officer_id:profile.id,
            age:createDto.age,
            minutes:createDto.minutes,
            seconds:createDto.seconds,
            test_date:createDto.test_date,
            gender:createDto.gender,
        })
        await this.officerWalkTestRepository.save(createTest);

        return{
            message:'Created Successfulyy'
        }
    }

    async getofficerwalktestrecords(accountId:number,user:any):Promise<walktest[]>{
        if(user?.sub !== accountId){
            throw new UnauthorizedException('Unauthorized Access')
        }

        const profile = await this.officerProfileRepository.findOne({
            where:{officer_account_id:accountId}
        })
        if(!profile){
            throw new NotFoundException('Account Not Found')
        }

        const profileId = profile.id;
        const walkrecord = await this.officerWalkTestRepository.find({
            where:{officer_id:profileId},
            order:{test_date:'DESC'}
        })

        return walkrecord;

    }

    async getSpecificRecordss (recordId:number,accountId:number,user:any):Promise<walktest>{
         if(user?.sub !== accountId){
            throw new UnauthorizedException('Unauthorized Access')
        }

        const profile = await this.officerProfileRepository.findOne({
            where:{officer_account_id:accountId}
        })
        if(!profile){
            throw new NotFoundException('Account Not Found')
        }

        const profileId = profile.id;
        const record = await this.officerWalkTestRepository.findOne({
            where:{id:recordId,officer_id:profileId}
        })

        if(!record){
            throw new NotFoundException('Record Not Found')
        }

        return record;
    }

    async updateofficerwalktest(UpdateDto:UpdateOfficerWalkDto,accountId:number,recordId:number,user:any):Promise<{message:string}>{
        if(user?.sub !== accountId){
            throw new UnauthorizedException('Unauthorized Access')
        }

        const profile = await this.officerProfileRepository.findOne({
            where:{officer_account_id:accountId}
        })
        if(!profile){
            throw new NotFoundException('Account Not Found')
        }

        const profileId = profile.id;
        const walkrecord = await this.officerWalkTestRepository.findOne({
            where:{id:recordId,officer_id:profileId}
        })
        if(!walkrecord){
            throw new NotFoundException('Record not found');
        }
        Object.assign(walkrecord,UpdateDto);
        await this.officerWalkTestRepository.save(walkrecord);
        return{
            message:"Updated the Walk record successfully"
        }
    }

    async deletewalkrecord(recordId:number,accountId:number,user:any):Promise<{message:string}>{
        if(user?.sub !== accountId){
            throw new UnauthorizedException('Unauthorized Access')
        }

        const profile = await this.officerProfileRepository.findOne({
            where:{officer_account_id:accountId}
        })
        if(!profile){
            throw new NotFoundException('Account Not Found')
        }

        const profileId = profile.id;
        const walkrecord = await this.officerWalkTestRepository.findOne({
            where:{id:recordId,officer_id:profileId}
        })

        if(!walkrecord){
            throw new NotFoundException('Record Not Found')
        }
        await this.officerWalkTestRepository.delete(walkrecord)
        return{
            message:'Deleted the record successfully'
        }
    }
}