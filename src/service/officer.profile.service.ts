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
import { administrator } from 'src/entities/administrator.entity';

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
        private pushUpRepository: Repository<officer1minpushup>,

        @InjectRepository(administrator)
        private adminRepository:Repository<administrator>
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

    async getallofficerbmi(adminId: number): Promise<officerbmi[]> {
    
    const admin = await this.adminRepository.findOne({
        where: { id: adminId }
    });

    if (!admin) {
        throw new NotFoundException('Admin account not found');
    }

    // For admin, just return ALL BMI records
    const officerBmiRecords = await this.officerBmiRepository.find({
        // Include officer profile if needed
    });
    
    return officerBmiRecords;
}


 async getofficerbmirecordbyid(bmiId: number, adminId: number): Promise<officerbmi> {
    const admin = await this.adminRepository.findOne({
        where: { id: adminId }
    });

    if (!admin) {
        throw new NotFoundException('Admin account not found');
    }

    const officerBmiRecord = await this.officerBmiRepository.findOne({
        where: { id: bmiId }
    });

    if (!officerBmiRecord) {
        throw new NotFoundException(`BMI record with ID ${bmiId} not found`);
    }

    return officerBmiRecord;
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


async updateofficerbmi(bmiId:number,adminId:number,updateDto:UpdateOfficerBmiDto,user:any):Promise<{message:string}>{
    if(user?.sub !== adminId){
        throw new UnauthorizedException('Unauthorized Access')
    }

    const admin = await this.adminRepository.findOne({
        where:{id:adminId}
    })
    if(!admin){
     throw new NotFoundException('Admin Account is not Found')
    }

    const bmirecord = await this.officerBmiRepository.findOne({
        where:{id:bmiId}
    })

    if(!bmirecord){
        throw new NotFoundException('Record not Found')
    }
    Object.assign(bmirecord,updateDto)
    await this.officerBmiRepository.save(bmirecord)
    return{
        message:'Updated successfully'
    }
}

async deletbmibyadmin(recordId:number,adminId:number,user:any):Promise<{message:string}>{
    if(user?.sub !== adminId){
        throw new UnauthorizedException('Unauthorized access')
    }

    const admin = await this.adminRepository.findOne({
        where:{id:adminId}
    })
    if(!admin){
        throw new NotFoundException('Admin Account not found')
    }

    const record = await this.officerBmiRepository.findOne({
        where:{id:recordId}
    })
    if(!record){
        throw new NotFoundException('Bmi record not found')
    }

    await this.officerBmiRepository.delete(recordId)
    return{
        message:'Deleted the bmi successfully'
    }
}
async updateOfficerBmi(bmiRecordId:number,updateOfficerBmiDto:UpdateOfficerBmiDto,accountId:number,user:any):Promise<{message:string}>{
    if(user?.sub !== accountId){
        throw new UnauthorizedException('Unauthorized access');
    }
    const officerProfile = await this.officerProfileRepository.findOne({
        where:{officer_account_id:accountId}
    })

    if(!officerProfile){
        throw new NotFoundException('Account profile not found');
    }

    const bmiRecord = await this.officerBmiRepository.findOne({
        where:{id:bmiRecordId,officer_profile_id:officerProfile.id}
    })
    if(!bmiRecord){
        throw new NotFoundException('BMI record not found');
    }
    Object.assign(bmiRecord,updateOfficerBmiDto);
    await this.officerBmiRepository.save(bmiRecord);
    return{
        message:'Updated the BMI record successfully'
    }

}

async deleteOfficerBmi(bmiRecordId:number,accountId:number,user:any){
    if(user?.sub !== accountId){
        throw new UnauthorizedException('Unauthorized access');
    }
    const officerProfile = await this.officerProfileRepository.findOne({
        where:{officer_account_id:accountId}
    })

    if(!officerProfile){
        throw new NotFoundException('Account profile not found');
    }

    const bmiRecord = await this.officerBmiRepository.findOne({
        where:{id:bmiRecordId,officer_profile_id:officerProfile.id}
    })
    if(!bmiRecord){
        throw new NotFoundException('BMI record not found');
    }
    await this.officerBmiRepository.remove(bmiRecord);
    return{
        message:'Deleted the BMI record successfully'
    }
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

    async getallpushuprecord(adminId: number, user: any): Promise<officer1minpushup[]> {
    if (user?.sub !== adminId) {
        throw new UnauthorizedException('Unauthorized access');
    }

    const admin = await this.adminRepository.findOne({
        where: { id: adminId }
    });

    if (!admin) {
        throw new NotFoundException('Admin account not found');
    }

    const pushupRecord = await this.pushUpRepository.find();
    return pushupRecord;
}


    async getofficerpushrecordbyid(adminId:number,recordId:number,user:any):Promise<officer1minpushup>{
       if (user?.sub !== adminId) {
        throw new UnauthorizedException('Unauthorized access');
    }

    const admin = await this.adminRepository.findOne({
        where: { id: adminId }
    });

    if (!admin) {
        throw new NotFoundException('Admin account not found');
    }

        const pushuprecord = await this.pushUpRepository.findOne({
            where:{id:recordId}
        })

        if(!pushuprecord){
            throw new NotFoundException('Office Record Not Found')
        }

        return pushuprecord;
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

   async updateOfficer1minPushup(
    pushupId: number, 
    updateDto: UpdateOfficer1minPushupDto,
    accountId: number
): Promise<{ message: string }> {
    // Find profile
    const profile = await this.officerProfileRepository.findOne({
        where: { officer_account_id: accountId }
    });
    
    if (!profile) {
        throw new NotFoundException('Officer profile not found');
    }
    
    // Find SPECIFIC record by ID
    const pushupRecord = await this.pushUpRepository.findOne({
        where: {
            id: pushupId,  // ← Use the ID from URL
            officer_id: profile.id
        }
    });
    
    if (!pushupRecord) {
        throw new NotFoundException('Push-up record not found');
    }
    
    // Update
    Object.assign(pushupRecord, updateDto);
    await this.pushUpRepository.save(pushupRecord);
    
    return { message: 'Updated successfully' };
}

async adminupdatepushup(adminId:number,recordId:number,updateDto:UpdateOfficer1minPushupDto,user:any):Promise<{message:string}>{
       if (user?.sub !== adminId) {
        throw new UnauthorizedException('Unauthorized access');
    }

    const admin = await this.adminRepository.findOne({
        where: { id: adminId }
    });

    if (!admin) {
        throw new NotFoundException('Admin account not found');
    }

        const pushuprecord = await this.pushUpRepository.findOne({
            where:{id:recordId}
        })

        if(!pushuprecord){
            throw new NotFoundException('Office Record Not Found')
        }
        Object.assign(pushuprecord,updateDto)
        await this.pushUpRepository.save(pushuprecord)
        return {
            message:'Update the pushup record successfully'
        }
}

async deletepushupbyadmin(adminId:number,recordId:number,user:any):Promise<{message:string}>{
         if (user?.sub !== adminId) {
        throw new UnauthorizedException('Unauthorized access');
    }

    const admin = await this.adminRepository.findOne({
        where: { id: adminId }
    });

    if (!admin) {
        throw new NotFoundException('Admin account not found');
    }

        const pushuprecord = await this.pushUpRepository.findOne({
            where:{id:recordId}
        })

        if(!pushuprecord){
            throw new NotFoundException('Office Record Not Found')
        }

        await this.pushUpRepository.delete(recordId)
        return{
            message:'deleted the record successfully'
        }
}
    async deletepushUp(pushUpId:number,user:any):Promise<{message:string}>{
        const accountId = user.sub;
        const profile = await this.officerProfileRepository.findOne({
            where:{officer_account_id:accountId}
        })
        if(!profile){
            throw new NotFoundException('Officer profile not found');
        }
        const profileId = profile.id;
        const pushUpRecord = await this.pushUpRepository.findOne({
            where:{
                id:pushUpId,
                officer_id:profileId
            }
        })
        if(!pushUpRecord){
            throw new NotFoundException('1-Minute Pushup record not found');
        }
        await this.pushUpRepository.delete(
            pushUpId
        )
        return{
            message:'Deleted the record successfully'
        }
    }
}