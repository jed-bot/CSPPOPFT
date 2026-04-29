import {Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Not, Repository, TreeRepository} from 'typeorm';
import { ConflictException,NotFoundException} from '@nestjs/common';
import {officerprofile} from 'src/entities/officerprofile.entity';
import { CreateOfficerBmiDto,createofficerbmibyother } from 'src/officer_bmi_dto/create.officer.bmi.dto';
import { officerbmi } from 'src/entities/officerbmi.entity';
import { UpdateOfficerBmiDto } from 'src/officer_bmi_dto/update.officer.bmi.dto';
import { administrator } from 'src/entities/administrator.entity';

@Injectable()
export class OfficerBmiService{
    constructor(
        @InjectRepository(officerprofile)
        private readonly officerProfileRepository: Repository<officerprofile>,

        @InjectRepository(officerbmi)
        private officerBmiRepository:Repository<officerbmi>,

        @InjectRepository(administrator)
        private adminRepository:Repository<administrator>
    ){}

    async createofficerbmibyother(createDto:createofficerbmibyother,user:any):Promise<{message:string}>{
        if(!user){
            throw new UnauthorizedException('You are not yet verified')
        }
        const profile = await this.officerProfileRepository.findOne({
            where:{id:createDto.officer_profile_id}
        })

        if(!profile){
            throw new NotFoundException('Officer Profile not found')
        }
        const createbmi = this.officerBmiRepository.create({
            officer_profile_id:createDto.officer_profile_id,
            height_meter: createDto.height_meter,
            weight_kg: createDto.weight_kg,
            month_taken: createDto.month_taken,
        })

        
        await this.officerBmiRepository.save(createbmi)

        return{
            message:'Created Successfully'
        }

    }
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
}