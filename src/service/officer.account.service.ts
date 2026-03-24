import { CreateOfficerAccountDto } from "src/officer_account_dto/create.officer.account.dto";
import { InjectRepository } from '@nestjs/typeorm';
import {Not, Repository, TreeRepository} from 'typeorm';
import { officeraccount } from "src/entities/officeraccount.entity";
import { ConflictException, Injectable, UnauthorizedException,NotFoundException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { LoginOfficerAccountDto } from "src/officer_account_dto/login.officer.account";
import { NotFoundError } from "rxjs";
import { CreateOfficerProfileDto } from "src/officer_profile_dto/create.officer.profile.dto";
import { officerprofile } from "src/entities/officerprofile.entity";
import { UpdateOfficerProfileDto } from "src/officer_profile_dto/update.officer.profile.dto";
import { DeleteOfficerProfileDto } from "src/officer_profile_dto/delete.officer.profile.dto";
import { DeleteOfficerAccountDto } from "src/officer_account_dto/delete.officer.account.dto";
import { ForgotOfficerAccountDto } from "src/officer_account_dto/forgot.officer.account";
import { UpdateOfficerAccountInfoDto } from "src/officer_account_dto/update.officer.account.info";
import { IsEmail } from "class-validator";

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

    async forgotOfficerPassword(forgotOfficerAccountDto:ForgotOfficerAccountDto,user:any):Promise<{message:string}>{
        const {email,newpassword} = forgotOfficerAccountDto;
        const account = await this.officerAccountRepository.findOne({
            where:{email}
        })

        if(!account){
            throw new NotFoundException('Officer account with this account is not found');
        }
        if(user?.sub !== account.id){
            throw new UnauthorizedException('Unauthorized access');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.has(forgotOfficerAccountDto,newpassword,saltRounds);

        account.password = hashedPassword;
        await this.officerAccountRepository.save(account);
        return{
            message:'Password reset successfully'
        }
    }
    async updateOfficerAccount(updateOfficerAccountInfoDto:UpdateOfficerAccountInfoDto,officerId:number,user:any):Promise<{message:string}>{
        const account = await this.officerAccountRepository.findOne({
            where:{id:officerId}
        })
        if(user?.sub !== officerId){
            throw new UnauthorizedException('Unauthorized access');
        }
        if(!account){
            throw new NotFoundException('Officer account not found');
        }
        Object.assign(account,{
            user_name:updateOfficerAccountInfoDto.user_name
        })
        await this.officerAccountRepository.save(account);
        return{
            message:'Officer account information updated successfully'
        }
    }

    async deletOfficerAccount(deleteOfficerAccountDto:DeleteOfficerAccountDto,officerId:number,user:any):Promise<{message:string}>{
        const {email,password} = deleteOfficerAccountDto;

        const account = await this.officerAccountRepository.findOne({
            where:{id:officerId}
        })

        if(user?.sub !== officerId){
            throw new UnauthorizedException('Unauthorized access');
        }
        if(!email||!password){
            throw new NotFoundException('Wrong Credentials');
        }

        if (!account){
            throw new NotFoundException('Officer account was not found');
        }
        if(!await bcrypt.compare(deleteOfficerAccountDto.password,account.password)){
            throw new UnauthorizedException('Invalid Credentials');
        }

        await this.officerAccountRepository.delete({id:officerId});
        return{
            message:'Officer account deleted successfully'
        }
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
            where:{id:officerId},
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
    
    // Delete using the correct foreign key field
    const deleteResult = await this.officerProfileRepository.delete({
        officer_account_id: officerId  // ← THIS IS THE FIX
    });
    
    // Optional: Check if profile was actually deleted
    if (deleteResult.affected === 0) {
        throw new NotFoundException('Officer profile not found');
    }
    
    return {
        message: 'Officer profile deleted successfully'
    }
}

   
}