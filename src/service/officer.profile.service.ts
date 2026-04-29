import { InjectRepository } from '@nestjs/typeorm';
import {Not, Repository, TreeRepository} from 'typeorm';
import { officeraccount } from "src/entities/officeraccount.entity";
import { ConflictException, Injectable, UnauthorizedException,NotFoundException } from "@nestjs/common";
import { CreateOfficerProfileDto } from "src/officer_profile_dto/create.officer.profile.dto";
import { officerprofile } from "src/entities/officerprofile.entity";
import { UpdateOfficerProfileDto } from "src/officer_profile_dto/update.officer.profile.dto";
import { DeleteOfficerProfileDto } from "src/officer_profile_dto/delete.officer.profile.dto";
import { administrator } from "src/entities/administrator.entity";


@Injectable()
export class OfficerProfileService{
    constructor(
        @InjectRepository(officeraccount)
        private readonly officerAccountRepository: Repository<officeraccount>,

        @InjectRepository(officerprofile)
        private readonly officerProfileRepository:Repository<officerprofile>,

        @InjectRepository(administrator)
        private readonly adminRepo:Repository<administrator>
    ){}

async getallofficerprofile(user:any):Promise<officerprofile[]>{
      if(user?.sub !== user.id){
        throw new UnauthorizedException('Unauthorized access')
      }

      const profileId = user.id;
      const profile = await this.adminRepo.findOne({
        where:{id:profileId}
      })

      if(!profile){
        throw new NotFoundException('Admin Account not Found')
      }

      const officerprofiles = await this.officerProfileRepository.find()
      return officerprofiles;
    }

      async getofficerprofilebyid(profileId:number,user:any):Promise<officerprofile>{
      if(user?.sub !== user.id){
        throw new UnauthorizedException('Unauthorized access')
      }
      const adminId = user.id;
      const admin =  await this.adminRepo.findOne({
        where:{id:user.id}
      }) 
    
      if(!admin){
        throw new NotFoundException('Account not found')
      }
      const officerprofile = await this.officerProfileRepository.findOne({
        where:{id:profileId}
      })
      if(!officerprofile){
        throw new NotFoundException('Officer Profile Not Found')
      }
      return officerprofile;
  }

  async createofficerProfile(createOfficerProfileDto:CreateOfficerProfileDto,officerId:number,user:any):Promise<Partial<officerprofile>>{
        if(user?.sub !== officerId){
            throw new UnauthorizedException('Unathorized access');
        }
        const ExistingProfile = await this.officerProfileRepository.findOne({
            where:{officer_account_id:officerId}
        })
        if(ExistingProfile){
            throw new ConflictException('Officer profile already exists');
        }
        
        const newProfile = this.officerProfileRepository.create({
            officer_account_id:officerId,
            first_name:createOfficerProfileDto.first_name,
            middle_name:createOfficerProfileDto.middle_name,
            last_name:createOfficerProfileDto.last_name,
            age:createOfficerProfileDto.age,
            sex:createOfficerProfileDto.sex,
            birthday:createOfficerProfileDto.birthday,
            office_unit:createOfficerProfileDto.office_unit,
        })

        const saveProfile = await this.officerProfileRepository.save(newProfile);
        return saveProfile;
        
        
    }
    async deleteOfficerAccount(deleteOfficerProfileDto:DeleteOfficerProfileDto,officerId:number,user:any):Promise<{message:string}>{
        const {email,password} = deleteOfficerProfileDto;
        const account = await this.officerAccountRepository.findOne({
            where:{id:officerId}
        })

        if(!account){
            throw new NotFoundException('Officer account not found')
        }
        if(!email || !password){
            throw new NotFoundException('Wrong credentials');
        }
        if(user?.sub !== officerId){
            throw new UnauthorizedException('Unauthorized access');
        }
        await this.officerAccountRepository.delete({id:officerId});
        return {
            message:'Officer account deleted successfully'
        }
    }
    async getOfficerProfile(officerId:number,user:any):Promise<Partial<officerprofile>>{
        if(user?.sub !== officerId){
            throw new UnauthorizedException('Unauthorized access');
        }
        const profile = await this.officerProfileRepository.findOne({
            where:{officer_account_id: officerId },
            select:['first_name','middle_name','last_name','sex','birthday','office_unit']
        })
        if(!profile){
            throw new NotFoundException('Officer profile not found');
        }
        return profile;
    }
    async UpdateOfficerProfile(officerId:number,updateOfficerProfileDto:UpdateOfficerProfileDto,user:any):Promise<{message:string}>{
        const profile = await this.officerProfileRepository.findOne({
            where:{id:officerId}
        })
        if(user?.sub !== officerId){
            throw new UnauthorizedException('Unauthorized access');
        }
        if(!profile){
            throw new NotFoundException('Officer account is not found');
        }
        Object.assign(profile,{
            first_name:updateOfficerProfileDto.newfirst_name,
            middle_name:updateOfficerProfileDto.newmiddle_name,
            last_name:updateOfficerProfileDto.newlast_name,
            office_unit:updateOfficerProfileDto.newoffice_unit
        })
        await this.officerProfileRepository.save(profile);

        return{
            message:'Updated officer profile successfully'
        }
    } 
    async deleteOfficerProfile(deleteOfficerProfileDto: DeleteOfficerProfileDto,officerId: number,user: any
): Promise<{message: string}> {
    const {email, password} = deleteOfficerProfileDto;
    
    // Verify account exists
    const account = await this.officerAccountRepository.findOne({
        where: {id: officerId}
    });

    if(!email || !password) {
        throw new NotFoundException('Wrong credentials');
    }

    if(!account) {
        throw new NotFoundException('Officer account not found');
    }
    
    if (user?.sub !== officerId) {
        throw new UnauthorizedException('Unauthorized access');
    }
    

    const deleteResult = await this.officerProfileRepository.delete({
        officer_account_id: officerId  
    });
    

    if (deleteResult.affected === 0) {
        throw new NotFoundException('Officer profile not found');
    }
    
    return {
        message: 'Officer profile deleted successfully'
    }
}


async deleteofficerprofile(user:any,officerId:number):Promise<{message:string}>{
    if(user?.sub !== user.id){
      throw new UnauthorizedException('Unauthorized Access')
    }

    const admin = await this.adminRepo.findOne({
      where:{id:user.id}
    })
    if(!admin){
      throw new NotFoundException('Account not found')
    }
    const officcerAccount = await this.officerProfileRepository.findOne({
      where:{id:officerId,}
    })
    if(!officeraccount){
      throw new NotFoundException('Account Not Found');
    }
    await this.officerProfileRepository.delete(officerId)

    return{
      message:'Deleted the profile successfully'
    }
  }

    }