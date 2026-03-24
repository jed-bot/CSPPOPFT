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


  async createOfficerbmi(
    createOfficerBmiDto: CreateOfficerBmiDto,
    accountId: number,  // This is the account ID from req.user.sub
    user: any
): Promise<{ message: string }> {
    
    // Check authorization
    if (user?.sub !== accountId) {
        throw new UnauthorizedException('Unauthorized access');
    }
    
    // Find the profile using the account ID
    const profile = await this.officerProfileRepository.findOne({
        where: { officer_account_id: accountId }
    });
    
    if (!profile) {
        throw new NotFoundException(`Profile not found for account ID ${accountId}. Please create a profile first.`);
    }
    
    // Get the actual profile ID
    const profileId = profile.id;
    
    // Create BMI record - only provide height, weight, and month_taken
    // Let the database calculate BMI and category automatically
    const createBmi = this.officerBmiRepository.create({
        officer_profile_id: profileId,  // Use the actual profile ID
        height_meter: createOfficerBmiDto.height_meter,
        weight_kg: createOfficerBmiDto.weight_kg,
        month_taken: createOfficerBmiDto.month_taken,
        // Don't include bmi and category - let database handle it
    });
    
    await this.officerBmiRepository.save(createBmi);
    
    return {
        message: 'Added the BMI Successfully'
    };
}
    }

 