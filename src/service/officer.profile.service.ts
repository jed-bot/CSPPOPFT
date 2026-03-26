import {Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Not, Repository, TreeRepository} from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConflictException,NotFoundException} from '@nestjs/common';
import { CreateOfficerProfileDto } from 'src/officer_profile_dto/create.officer.profile.dto';
import {officerprofile} from 'src/entities/officerprofile.entity';
import {OfficerAccountService} from 'src/service/officer.account.service';
import { UpdateOfficerProfileDto } from 'src/officer_profile_dto/update.officer.profile.dto';
import { CreateOfficerBmiDto } from 'src/officer_bmi_dto/create.officer.bmi.dto';
import { officeraccount } from 'src/entities/officeraccount.entity';
import { officerbmi } from 'src/entities/officerbmi.entity';
import { UpdateOfficerBmiDto } from 'src/officer_bmi_dto/update.officer.bmi.dto';
import { CreateOfficer1minPushupDto } from 'src/officer1min_push_dto/create.1min.psuhup.dto';
import { officer1minpushup } from 'src/entities/officer1minpushup.entity';
import { profile } from 'console';
import { UpdateOfficer1minPushupDto } from 'src/officer1min_push_dto/update.1min.pushup';

@Injectable()
export class OfficerProfileService{
    constructor(
        @InjectRepository(officerprofile)
        private readonly officerProfileRepository: Repository<officerprofile>,
        private readonly jwtService:JwtService,
        private readonly officerAccountService: OfficerAccountService,
        
        @InjectRepository(officerbmi)
        private officerBmiRepository:Repository<officerbmi>,

        @InjectRepository(officer1minpushup)
        private pushUpRepository: Repository<officer1minpushup>
    ){}


  async createOfficerbmi(createOfficerBmiDto: CreateOfficerBmiDto,accountId: number,user: any): Promise<{ message: string }> {
    if (user?.sub !== accountId) {
        throw new UnauthorizedException('Unauthorized access');
    }
    const profile = await this.officerProfileRepository.findOne({
        where: { officer_account_id: accountId }
    });
    if (!profile) {
        throw new NotFoundException(`Profile not found for account ID ${accountId}. Please create a profile first.`);
    }
    const profileId = profile.id;
    const createBmi = this.officerBmiRepository.create({
        officer_profile_id: profileId,  
        height_meter: createOfficerBmiDto.height_meter,
        weight_kg: createOfficerBmiDto.weight_kg,
        month_taken: createOfficerBmiDto.month_taken,
    });
    await this.officerBmiRepository.save(createBmi);
    return {
        message: 'Added the BMI Successfully'
    };
}

   async getOfficerBmi(accountId: number, user: any): Promise<officerbmi[]> {  
    if (user?.sub !== accountId) {
        throw new UnauthorizedException('Unauthorized access');
    }
    
    const profile = await this.officerProfileRepository.findOne({
        where: { officer_account_id: accountId }
    });
    
    if (!profile) {
        throw new NotFoundException(`Officer profile not found for account ID ${accountId}`);
    }

    const profileId = profile.id;
    const bmiRecords = await this.officerBmiRepository.find({
        where: { officer_profile_id: profileId },
        order: { month_taken: 'DESC' }
    });
    
    return bmiRecords;
}

   async updateOfficerBmi(
    accountId: number, 
    updateOfficerBmiDto: UpdateOfficerBmiDto, 
    user: any
): Promise<{ message: string }> {
    if (user?.sub !== accountId) {
        throw new UnauthorizedException('Unauthorized access');
    }
    const officerProfile = await this.officerProfileRepository.findOne({
        where: { officer_account_id: accountId }
    });

    if (!officerProfile) {
        throw new NotFoundException(`Officer profile not found for account ID ${accountId}`);
    }

    const profileId = officerProfile.id;

    const bmiRecord = await this.officerBmiRepository.findOne({
        where: { officer_profile_id: profileId }
    });

    if (!bmiRecord) {
        throw new NotFoundException('BMI record not found for this officer');
    }
    Object.assign(bmiRecord, {
        height_meter: updateOfficerBmiDto.height_meter,
        weight_kg: updateOfficerBmiDto.weight_kg,
        month_taken: updateOfficerBmiDto.month_taken
    });

    await this.officerBmiRepository.save(bmiRecord);
    
    return {
        message: 'BMI updated successfully'
    };
}
async deleteOfficerBmi(accountId: number, user: any): Promise<{ message: string }> {
    // Check authorization
    if (user?.sub !== accountId) {
        throw new UnauthorizedException('Unauthorized access');
    }

    // STEP 1: Find the profile using the account ID
    const officerProfile = await this.officerProfileRepository.findOne({
        where: { officer_account_id: accountId }
    });

    if (!officerProfile) {
        throw new NotFoundException(`Officer profile not found for account ID ${accountId}`);
    }

    const profileId = officerProfile.id;

    
    const bmiRecord = await this.officerBmiRepository.findOne({
        where: { officer_profile_id: profileId }
    });

    if (!bmiRecord) {
        throw new NotFoundException('BMI record not found for this officer');
    }
    await this.officerBmiRepository.delete({ id: bmiRecord.id });
    
    return {
        message: 'BMI record deleted successfully'
    };
}
async createOfficer1minPushup(
    createOfficer1minPushupDto: CreateOfficer1minPushupDto,
    accountId: number, 
    user: any
): Promise<{ message: string }> {
    
    if (user?.sub !== accountId) {
        throw new UnauthorizedException('Unauthorized access');
    }

    
    const officerProfile = await this.officerProfileRepository.findOne({
        where: { officer_account_id: accountId }
    });

    if (!officerProfile) {
        throw new NotFoundException(`Officer profile not found for account ID ${accountId}`);
    }


    const profileId = officerProfile.id;


    const pushupRecord = this.pushUpRepository.create({
        officer_id: profileId, 
        gender: createOfficer1minPushupDto.gender,
        age: createOfficer1minPushupDto.age,
        reps: createOfficer1minPushupDto.reps,
        test_date: createOfficer1minPushupDto.test_date,
       
    });

    
    await this.pushUpRepository.save(pushupRecord);
    
    return {
        message: '1-Minute Pushup record added successfully'
    };
}

    async getOfficer1minPushup(accountId:number,user:any):Promise<{officer1minpushup: any[]}>{
        if(user?.sub !== accountId){
            throw new UnauthorizedException('Unauthorized access');
        }
        const profile = await this.officerProfileRepository.findOne({
            where:{officer_account_id: accountId}
        });
        if(!profile){
            throw new NotFoundException('Officer profile not found');
        }
        const profileId = profile.id;
        const pushupRecords = await this.pushUpRepository.find({
            where:{officer_id:profileId},
            order:{test_date:'DESC'}
        });
        return {officer1minpushup:pushupRecords}
    }

    async updateOfficer1minPushup(updateOfficer1minPushupDto: UpdateOfficer1minPushupDto,accountId:number,user:any):Promise<{message:string}>{
        if(user?.sub!==accountId){
            throw new UnauthorizedException('Unauthorized access');
        }

        const profile = await this.officerProfileRepository.findOne({
            where:{officer_account_id:accountId}
        });
        if(!profile){
            throw new NotFoundException('Officer profile not found');
        }

        const profileId = profile.id;
        const pushupRecord = await this.pushUpRepository.findOne({
            where:{officer_id:profileId}
        })
        if(!pushupRecord){
            throw new NotFoundException('1-Minute Pushup record not found');
        }

        Object.assign(pushupRecord,{
            gender: updateOfficer1minPushupDto.gender, 
            age: updateOfficer1minPushupDto.age,
            reps: updateOfficer1minPushupDto.reps,
            test_date: updateOfficer1minPushupDto.test_date
        })
        await this.pushUpRepository.save(pushupRecord);
        return{
            message:'Updated successfully'
        }
    }
}