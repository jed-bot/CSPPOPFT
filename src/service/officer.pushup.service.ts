import {Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Not, Repository, TreeRepository} from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException,NotFoundException} from '@nestjs/common';
import {officerprofile} from 'src/entities/officerprofile.entity';
import { CreateOfficer1minPushupDto,CreateOfficerPushupDtoByOther } from 'src/officer1min_push_dto/create.1min.psuhup.dto';
import { officer1minpushup } from 'src/entities/officer1minpushup.entity';
import { UpdateOfficer1minPushupDto } from 'src/officer1min_push_dto/update.1min.pushup';
import { administrator } from 'src/entities/administrator.entity';

@Injectable()
export class OfficerPushUpService{
    constructor(
        @InjectRepository(officerprofile)
        private readonly officerProfileRepository:Repository<officerprofile>,

        @InjectRepository(officer1minpushup)
        private pushUpRepository: Repository<officer1minpushup>,

        @InjectRepository(administrator)
        private adminRepository:Repository<administrator>
    ){}

    async createOfficerpushupbyother(createDto:CreateOfficerPushupDtoByOther,accountId:number,user:any):Promise<{message:string}>{
        if(user?.sub !== accountId){
            throw new UnauthorizedException('Unauthorized access')
        }

        const officerProfile = await this.officerProfileRepository.findOne({
            where:{officer_account_id:accountId}
        })

        if(!officerProfile){
            throw new NotFoundException('Officer Account Not Found')
        }

        const pushUprecord = this.pushUpRepository.create({
            officer_id:createDto.officer_id,
            gender: createDto.gender,
            age: createDto.age,
            reps: createDto.reps,
            test_date: createDto.test_date,
        })

        await this.pushUpRepository.save(pushUprecord)
        return{
            message:'Recorded Successfully'
        }
    }

    async createOfficer1minPushup(createOfficer1minPushupDto: CreateOfficer1minPushupDto,accountId: number, user: any): Promise<{ message: string }> 
    {
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