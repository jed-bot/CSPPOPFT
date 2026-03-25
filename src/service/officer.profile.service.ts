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



@Injectable()
export class OfficerProfileService{
    constructor(
        @InjectRepository(officerprofile)
        private readonly officerProfileRepository: Repository<officerprofile>,
        private readonly jwtService:JwtService,
        private readonly officerAccountService: OfficerAccountService,
        
        @InjectRepository(officerbmi)
        private officerBmiRepository:Repository<officerbmi>
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

    async getOfficerBmi(accountId: number, user: any): Promise<officerbmi> {
    // Check authorization
    if (user?.sub !== accountId) {
        throw new UnauthorizedException('Unauthorized access');
    }
    
    // STEP 1: Find the profile using the account ID
    const profile = await this.officerProfileRepository.findOne({
        where: { officer_account_id: accountId }
    });
    
    if (!profile) {
        throw new NotFoundException(`Officer profile not found for account ID ${accountId}`);
    }
    
    // STEP 2: Get the actual profile ID
    const profileId = profile.id;
    
    // STEP 3: Find BMI using the actual profile ID
    const bmiRecord = await this.officerBmiRepository.findOne({
        where: { officer_profile_id: profileId }
    });
    
    if (!bmiRecord) {
        throw new NotFoundException('BMI record not found for this officer');
    }
    
    return bmiRecord;
}

   async updateOfficeBmi(
    accountId: number, 
    updateOfficerBmiDto: CreateOfficerBmiDto, 
    user: any
): Promise<{ message: string }> {
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

    // STEP 2: Get the actual profile ID
    const profileId = officerProfile.id;

    // STEP 3: Find the BMI record using the actual profile ID
    const bmiRecord = await this.officerBmiRepository.findOne({
        where: { officer_profile_id: profileId }
    });

    if (!bmiRecord) {
        throw new NotFoundException('BMI record not found for this officer');
    }

    // STEP 4: Update the BMI record
    Object.assign(bmiRecord, {
        height_meter: updateOfficerBmiDto.height_meter,
        weight_kg: updateOfficerBmiDto.weight_kg,
        month_taken: updateOfficerBmiDto.month_taken
        // Don't include bmi and category - let database calculate them
    });

    await this.officerBmiRepository.save(bmiRecord);
    
    return {
        message: 'BMI updated successfully'
    };
}
async deleteOfficerBmi(
    accountId: number, 
    user: any
): Promise<{ message: string }> {
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

    // STEP 2: Get the actual profile ID
    const profileId = officerProfile.id;

    // STEP 3: Find the BMI record using the actual profile ID
    const bmiRecord = await this.officerBmiRepository.findOne({
        where: { officer_profile_id: profileId }
    });

    if (!bmiRecord) {
        throw new NotFoundException('BMI record not found for this officer');
    }

    // STEP 4: Delete the BMI record
    await this.officerBmiRepository.delete({ id: bmiRecord.id });
    
    return {
        message: 'BMI record deleted successfully'
    };
}
}
 