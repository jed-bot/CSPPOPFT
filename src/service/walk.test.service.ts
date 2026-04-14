import { walktest } from "src/entities/officer.walk.test.entity";
import { Create2kmTestDto } from "src/walk_test_dto/create.walk.test.dto";
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm'; 
import { officerprofile } from 'src/entities/officerprofile.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateOfficerWalkDto } from "src/walk_test_dto/update.officer.walk.test.dto";
import { administrator } from "src/entities/administrator.entity";

@Injectable()
export class OfficerWalkTestService{
    constructor(
        @InjectRepository(officerprofile)
        private readonly officerProfileRepository:Repository<officerprofile>,
        @InjectRepository(walktest)
        private readonly officerWalkTestRepository:Repository<walktest>,
        @InjectRepository(administrator)
        private readonly adminRepository:Repository<administrator>
    ){}


   async createofficerwalktest(createDto: Create2kmTestDto, accountId: number, user: any): Promise<{ message: string }> {
    if (user?.sub !== accountId) {
        throw new UnauthorizedException('Unauthorized Access');
    }
    
    const profile = await this.officerProfileRepository.findOne({
        where: { officer_account_id: accountId }
    });

    if (!profile) {
        throw new NotFoundException('Account not found');
    }

    const timeFormatted = `${String(createDto.minutes).padStart(2, '0')}:${String(createDto.seconds).padStart(2, '0')}`;

    // Use TypeORM with parameterized query
    await this.officerWalkTestRepository
        .createQueryBuilder()
        .insert()
        .into(walktest)
        .values({
            officer_id: profile.id,
            gender: createDto.gender,
            age: createDto.age,
            minutes: createDto.minutes,
            seconds: createDto.seconds,
            test_date: createDto.test_date,
            time_formatted: timeFormatted,
            grade: () => `calc_grade('${createDto.gender}', ${createDto.age}, ${createDto.minutes}, ${createDto.seconds})`,
        })
        .execute();

    return {
        message: 'Created Successfully'
    };
}

    async getalladminwalkrecord(adminId:number,user:any):Promise<any[]>{
        if(user?.sub !== adminId){
            throw new UnauthorizedException('Unauthorized access')
        }

        const admin = await this.adminRepository.findOne({
            where:{id:adminId}
        })

        if(!admin){
            throw new NotFoundException('Admin Account not found')
        }
          const records = await this.officerWalkTestRepository.find({ 
    relations: ['officerprofile'] 
  })
  
  // Transform to include officer_name (full name)
  return records.map(record => ({
    id: record.id,
    officer_id: record.officer_id,
    officer_name: `${record.officerprofile?.first_name} ${record.officerprofile?.last_name}`.trim(),
    age: record.age,
    gender: record.gender,
    minutes: record.minutes,
    seconds: record.seconds,
    grade: record.grade,
    time_formatted: record.time_formatted,
    test_date: record.test_date,
    created_at: record.created_at
  }))
    }

    async admingetwalkrecordbyid(adminId:number,recordId:number,user:any):Promise<walktest>{
         if(user?.sub !== adminId){
            throw new UnauthorizedException('Unauthorized access')
        }

        const admin = await this.adminRepository.findOne({
            where:{id:adminId}
        })

        if(!admin){
            throw new NotFoundException('Admin Account not found')
        }
        const record  = await this.officerWalkTestRepository.findOne({
            where:{id:recordId}
        })
        if(!record){
            throw new NotFoundException('Record Not Found')
        }

        return record;
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

    

   async updatewalktestbyadmin(adminId:number,recordId:number,updatedto:UpdateOfficerWalkDto,user:any):Promise<{message:string}>{
     if(user?.sub !== adminId){
            throw new UnauthorizedException('Unauthorized access')
        }

        const admin = await this.adminRepository.findOne({
            where:{id:adminId}
        })

        if(!admin){
            throw new NotFoundException('Admin Account not found')
        }
        const record  = await this.officerWalkTestRepository.findOne({
            where:{id:recordId}
        })
        if(!record){
            throw new NotFoundException('Record Not Found')
        }
        Object.assign(record,updatedto)
        await this.officerWalkTestRepository.save(record)
        return{
            message:'Updated successfully'
        }
   }

async updateofficerwalktest(UpdateDto: UpdateOfficerWalkDto, accountId: number, recordId: number, user: any): Promise<{ message: string }> {
    if (user?.sub !== accountId) {
        throw new UnauthorizedException('Unauthorized Access');
    }

    const profile = await this.officerProfileRepository.findOne({
        where: { officer_account_id: accountId }
    });
    
    if (!profile) {
        throw new NotFoundException('Account Not Found');
    }

    const profileId = profile.id;
    const walkrecord = await this.officerWalkTestRepository.findOne({
        where: { id: recordId, officer_id: profileId }
    });
    
    if (!walkrecord) {
        throw new NotFoundException('Record not found');
    }
    
    // Get final values (use existing if not updating)
    const finalMinutes = UpdateDto.minutes ?? walkrecord.minutes;
    const finalSeconds = UpdateDto.seconds ?? walkrecord.seconds;
    const finalAge = UpdateDto.age ?? walkrecord.age;
    const finalGender = UpdateDto.gender ?? walkrecord.gender;
    const finalTestDate = UpdateDto.test_date ?? walkrecord.test_date;
    
    const timeFormatted = `${String(finalMinutes).padStart(2, '0')}:${String(finalSeconds).padStart(2, '0')}`;
    
    // ONE SQL UPDATE - updates everything including grade
    await this.officerWalkTestRepository
        .createQueryBuilder()
        .update(walktest)
        .set({
            gender: finalGender,
            age: finalAge,
            minutes: finalMinutes,
            seconds: finalSeconds,
            test_date: finalTestDate,
            time_formatted: timeFormatted,
            grade: () => `calc_grade('${finalGender}', ${finalAge}, ${finalMinutes}, ${finalSeconds})`,
        })
        .where("id = :id AND officer_id = :officer_id", { 
            id: recordId, 
            officer_id: profileId 
        })
        .execute();
    
    return {
        message: "Updated the Walk record successfully"
    };
}


    async deletebyAdmin(adminId:number,recordId:number,user:any):Promise<{message:string}>{
         if(user?.sub !== adminId){
            throw new UnauthorizedException('Unauthorized access')
        }

        const admin = await this.adminRepository.findOne({
            where:{id:adminId}
        })

        if(!admin){
            throw new NotFoundException('Admin Account not found')
        }
        const record  = await this.officerWalkTestRepository.findOne({
            where:{id:recordId}
        })
        if(!record){
            throw new NotFoundException('Record Not Found')
        }
        await this.officerWalkTestRepository.delete(recordId);
        return{
            message:'Deleted successfully'
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
        await this.officerWalkTestRepository.delete(recordId)
        return{
            message:'Deleted the record successfully'
        }
    }
}