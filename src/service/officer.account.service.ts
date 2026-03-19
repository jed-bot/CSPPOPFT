import { CreateOfficerAccountDto } from "src/officer_account_dto/create.officer.account.dto";
import { InjectRepository } from '@nestjs/typeorm';
import {Repository, TreeRepository} from 'typeorm';
import { officeraccount } from "src/entities/officeraccount.entity";
import { ConflictException, Injectable, UnauthorizedException,NotFoundException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { LoginOfficerAccountDto } from "src/officer_account_dto/login.officer.account";
import { NotFoundError } from "rxjs";
import { CreateOfficerProfileDto } from "src/officer_profile_dto/create.officer.profile.dto";
import { officerprofile } from "src/entities/officerprofile.entity";


@Injectable()
export class OfficerAccountService{
    constructor(
        @InjectRepository(officeraccount)
        private readonly officerAccountRepository: Repository<officeraccount>,
        private readonly jwtService:JwtService,
        @InjectRepository(officerprofile)
        private readonly officerProfileRepository:Repository<officerprofile>,
    ) {}

    async createOfficerAccount(createOfficerAccountDto:CreateOfficerAccountDto):Promise<Partial<officeraccount>>{
        const exsistingAccount = await this.officerAccountRepository.findOne({
            where:{
                email:createOfficerAccountDto.email
            }
        });
        if(exsistingAccount){
            throw new ConflictException('Account with this email already exsists');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createOfficerAccountDto.password,saltRounds);
        

        const newAccount = this.officerAccountRepository.create({
            email:createOfficerAccountDto.email,
            password:hashedPassword,
            user_name:createOfficerAccountDto.user_name,
            status:Boolean(createOfficerAccountDto.status),
            administrator_id:createOfficerAccountDto.administrator_id,
        });
        const saveAccoun = await this.officerAccountRepository.save(newAccount);
        const {password,...result} = saveAccoun;

        return result;
    }
    async loginOfficerAccount(loginOfficerAccountDto:LoginOfficerAccountDto):Promise<{message:string,bearer_token:string}>{
        const account  = await this.officerAccountRepository.findOne({
            where:{email:loginOfficerAccountDto.email}
        })
        if(!account){
            throw new NotFoundException('User with this email does not exsist');
        }
        if(!await bcrypt.compare(loginOfficerAccountDto.password,account.password)){
            throw new UnauthorizedException('Invalid credentials')
        }
        const payload = {sub:account.id,email:account.email,role:'officer'};
        const bearer_token = this.jwtService.sign(payload);
    
        return{
            message:'Login Successfull',
            bearer_token:bearer_token,
        }
    }
    async getOfficerAccountInfo(id:number,user:any):Promise<Promise<officeraccount>>{
        if(user?.sub !==id){
            throw new UnauthorizedException('Unauthorized access');
        }
        const account  = await this.officerAccountRepository.findOne({
            where:{id},
            select:['id','email','user_name','status','administrator_id']
        }) 
        if(!account){
            throw new NotFoundException('Oficer account not found');
        }
        return account;
    }
    
    async createOfficerProfile(createOfficerProfileDto:CreateOfficerProfileDto,officerId:number,user:any):Promise<{message:string}>{
        const account  = await this.officerAccountRepository.findOne({
            where:{id:officerId}
        })
        if(!account){
            throw new NotFoundException('Officer account not found');
        }
        return{
            message:'Officer profile created successfully'
        }
    }
    async getOfficerProfile(officerId:number,user:any):Promise<Partial<officerprofile>>{
        if(user?.sub !== officerId){
            throw new UnauthorizedException('Unauthorized access');
        }
        const profile = await this.officerProfileRepository.findOne({
            where:{id:officerId},
            select:['first_name','middle_name','last_name','gender','birth_date','office_unit']
        })
        if(!profile){
            throw new NotFoundException('Officer profile not found');
        }
        return profile;
    }
}