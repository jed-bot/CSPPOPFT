import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { officerprofile } from 'src/entities/officerprofile.entity';
import {officersitup1min} from 'src/entities/officersitup1min.entity';
import { CreateSitUpDto } from 'src/officer_situp_1min/create.officer.1minsitup.dto';
import { Repository } from 'typeorm';
import { UpdateSitUpDto } from 'src/officer_situp_1min/update.officer.1minsitup.dto';

@Injectable()
export class OfficerPftTestService{
    constructor(
        @InjectRepository(officersitup1min)
        private readonly officersitupTest: Repository<officersitup1min>,
        @InjectRepository(officerprofile)
        private readonly officerProfileRepository:Repository<officerprofile>,
    ){}
    async createofficer1minstup(createDto:CreateSitUpDto,accountId:number,user:any ):Promise<{message:string}>{
        if(user?.sub !== accountId){
            throw new UnauthorizedException('Unauthoried Access');
        }
        const officerProfile = await this.officerProfileRepository.findOne({
            where:{officer_account_id:accountId}
        })

        if(!officerProfile){
            throw new NotFoundException('Account not foound');
        }

        const profileId = officerProfile.id;
        const createsitUp  = this.officersitupTest.create({
            officer_id: officerProfile.id,
            age: createDto.age,
            gender: createDto.gender,
            reps: createDto.reps,
            test_date: createDto.test_date,
        })
        await this.officersitupTest.save(createsitUp)
        return{
            message:'Added the sit up successfully'
        }
    }
    async getofficersituprecords(accountId:number,user:any):Promise<officersitup1min[]>{
        if(user?.sub !== accountId){
            throw new UnauthorizedException('Unauthorized access')
        }
        const profile = await this.officerProfileRepository.findOne({
            where:{officer_account_id:accountId}
        })
        if(!profile){
            throw new NotFoundException('Account Not Found');
        }
        const profileId = profile.id;
        const sitUpRecord = await this.officersitupTest.find({
            where:{officer_id:profileId},
            order:{test_date:'DESC'}
        })
        return sitUpRecord;
    }

    async getOfficerSpecificRecord(recordId:number,accountId:number,user:any):Promise<officersitup1min>{
        const profile =  await this.officerProfileRepository.findOne({
            where:{officer_account_id:accountId}
        })

        if(!profile){
            throw new NotFoundException('Account not found');
        }
        const profileId = profile.id
        const sitUpRecord = await this.officersitupTest.findOne({
            where:{id:recordId,officer_id:profileId},
        })
        if(!sitUpRecord){
            throw new NotFoundException('Record not found')
        }
        return sitUpRecord;
    }

    async updateOfficersitupRecord(updatesitUpDto:UpdateSitUpDto,recordId:number,accountId:number,user:any):Promise<{message:string}>{
        if(user?.sub !== accountId){
            throw new UnauthorizedException('Unauthorized access')
        }
        const profile =  await this.officerProfileRepository.findOne({
            where:{officer_account_id:accountId}
        })
        if(!profile){
            throw new NotFoundException('Officer Account not found');
        }
        const profileId = profile.id;
        const sitUpRecord = await this.officersitupTest.findOne({
            where:{id:recordId,officer_id:profile.id}
        })
        if(!sitUpRecord){
            throw new NotFoundException('Record not found');
        }
        Object.assign(sitUpRecord,updatesitUpDto);
        await this.officersitupTest.save(sitUpRecord)

        return{
            message:'Successfully updated the sitUp Record'
        }

    }

    async deletsitUprecord(recordId:number,accountId:number,user:any):Promise<{message:string}>{
        if(user?.sub !== accountId){
            throw new UnauthorizedException('Unauthorized access')
        }
        const profile = await this.officerProfileRepository.findOne({
            where:{officer_account_id:accountId}
        })

        if(!profile){
            throw new NotFoundException('Officer Profile Not Found')
        }
        const profileId = profile.id;
        const sitUpRecord = await this.officersitupTest.findOne({
            where:{id:recordId,officer_id:profile.id}
        })

        if(!sitUpRecord){
            throw new NotFoundException('Officer sit up record is not found')
        }
        await this.officersitupTest.delete(recordId)
        return{
            message:'Deleted successfully'
        }
    }
}