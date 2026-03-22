import {Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DeleteDateColumn, Not, Repository, TreeRepository} from 'typeorm';
import { administrator } from 'src/entities/administrator.entity';
import {CreateAdminDto} from 'src/admin_dto/create.admin.dto';
import { LoginAdminDto } from 'src/admin_dto/login.admin.dto';
import { ForgotPasswordDto } from 'src/admin_dto/fogot.admin.dto';
import { UpdateAdminInfoDto } from 'src/admin_dto/update.admin.info';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConflictException,NotFoundException} from '@nestjs/common';
import { DeleteAdminDto } from 'src/admin_dto/delete.admin.dto';
import { AdminStatusDto } from 'src/admin_dto/status.admin';
import { UpdateOfficerStatus } from 'src/officer_account_dto/update.officer.profile.dto';
import{officeraccount} from 'src/entities/officeraccount.entity';
import { OfficerAccountService } from 'src/service/officer.account.service';


@Injectable()
 export class AdminService {
  constructor(
    @InjectRepository(administrator)
    private readonly adminRepo: Repository<administrator>,
    private readonly jwtService:JwtService,
    @InjectRepository(officeraccount)
    private officerAccountRepo: Repository<officeraccount>, 
  ) {}

  async createAdmin(createAdminDto:CreateAdminDto):Promise<Partial<administrator>>{
    try{
        const existingAdmin = await this.adminRepo.findOne({
          where:{
            email:createAdminDto.email
          }
        });
        if(existingAdmin){
          throw new ConflictException('Admin with this email already exsists');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createAdminDto.password, saltRounds);

        const newAdmin = this.adminRepo.create({
          email:createAdminDto.email,
          password:hashedPassword,
          user_name:createAdminDto.user_name, 
          role:createAdminDto.role,
          department:createAdminDto.department,
          status:createAdminDto.status,
        });
       
        const saveAdmin = await this.adminRepo.save(newAdmin);
        
        const{password,...result} = saveAdmin;
       
        return result;
    }catch(error){
    
    throw error;
  }

  }

  async loginAdmin(loginAdminDto:LoginAdminDto):Promise<{message:string,bearer_token:string}>{
      
    const admin = await this.adminRepo.findOne({
        where:{
          email:loginAdminDto.email,  
        }
      });
      if(!admin){
        throw new NotFoundException('Invalid email or password');
      }
      if(!await bcrypt.compare(loginAdminDto.password,admin.password)){
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = {sub:admin.id,email:admin.email,role:admin.role};
      const token  = this.jwtService.sign(payload);

      return{
        message:'Login Successful',
        bearer_token:`${token}`
      }
  
    }
  async forgotPassword(forgotPasswordDto:ForgotPasswordDto,user:any):Promise<{message:string}>{
     const admin  = await this.adminRepo.findOne({
      where:{
        email:forgotPasswordDto.email,
      }
     });
     if(!admin){
      throw new NotFoundException('Admin with this email does not exist');
     }
     if(user?.sub !==admin.id){
      throw new UnauthorizedException('Unauthorized to reset password for this account');
     }
     
     const saltRounds = 10;
     const hashedPassword =  await bcrypt.hash(forgotPasswordDto.newpassword,saltRounds);

     admin.password = hashedPassword;
     await this.adminRepo.save(admin);

     return{
      message:'Password reset successfully'
     }
    } 

    async getAdmininfo(id:number,user:any):Promise<Partial<administrator>>{

      if(user?.sub !== id ){
        throw new UnauthorizedException('Unauthorized to accces this account information');
      }
      const admin = await this.adminRepo.findOne({
        where:{id},
        select :['id','email','user_name','role','department','status']
      });
      if(!admin){
        throw new NotFoundException('Admin with this account does not exsist');
      }
      return admin;
    }
    async getAdminInfoById(id:number,user:any):Promise<Partial<administrator>>{
      if(user?.sub !== id){
        throw new UnauthorizedException('Unauthorized Access');
      }
      const admin = await this.adminRepo.findOne({
        where:{id},
        select:['id','email','user_name','department']
      })
      if(!admin){
        throw new NotFoundException('Admin not Found')
      }
      return admin;
    }

    async deleteAdmin(deleteAdminDto:DeleteAdminDto,user:any)
    {
      const {email,password} = deleteAdminDto;
      if (!email || !password){
        throw new NotFoundException('Wrong Credentials');
      }
      const admin = await this.adminRepo.findOne({
        where:{email:deleteAdminDto.email}
      })
      if(!admin){
        throw new NotFoundException('Admin with this email does not exsist');
      }
      if(user?.sub !==admin.id){
        throw new UnauthorizedException('Unauthorized to delete this admin account');
      }
      if(!await bcrypt.compare(deleteAdminDto.password,admin.password)){
        throw new NotFoundException('Wrong Credentials');
      }
      await this.adminRepo.delete(admin.id);
      return{
        message:'Admin deleted successfully'
      }
    }
    async updateAdminStatus(updateStatusDto:AdminStatusDto,user:any):Promise<{message:string}>{
      const admin = await this.adminRepo.findOne({
        where:{email:updateStatusDto.email}
      });
      if(!admin){
        throw new NotFoundException('Admin with this email does not exsist');
      }
      if(user?.sub !== admin.id){
        throw new UnauthorizedException('Unauthorizede to update status');
      }
      if(!await bcrypt.compare(updateStatusDto.password,admin.password)){
        throw new NotFoundException('Wrong Credentials');
      }
      admin.status = updateStatusDto.status;
      await this.adminRepo.save(admin);
      return{
        message:'Admin status updated successfully'
      }
    }

    async updateAdminInfo(updateAdminInfoDto:UpdateAdminInfoDto,user:any):Promise<{message:string}>{
      const admin = await this.adminRepo.findOne({
        where:{id:user.sub}
      })

      if(!admin){
        throw new NotFoundException('Admin does not exsist');
      }

      if(user?.sub !== admin.id){
        throw new UnauthorizedException('Unauthorized access');
      }
      const emailExists = await this.adminRepo.findOne({
          where:{email:updateAdminInfoDto.email}
        })
      if(emailExists){
        throw new ConflictException('This is email is already used by another user');
      }
      
      Object.assign(admin,updateAdminInfoDto);
      await this.adminRepo.save(admin);

      return{
        message:"Admin information updated successfully"
      }
      
    }
    async updateOfficerStatus(updateOfficerStatus:UpdateOfficerStatus,user:any):Promise<{message:string}>{

       if (user?.role !== 'admin' && user?.role !== 'Administrator') {
        throw new UnauthorizedException(`Unauthorized access. User role: ${user?.role}`);
    }
      const officer = await this.officerAccountRepo.findOne({
        where:{email:updateOfficerStatus.email}
      })
      if(!officer){
        throw new NotFoundException('Officer with this email does not exsist');
      }
      officer.status = Boolean(updateOfficerStatus.status);
      await this.officerAccountRepo.save(officer);
      return{
        message:'Officer status updated successfully'
      }
    }

    async getAllofficerAccount(user:any):Promise<officeraccount[]>{
     if(!user){
      throw new UnauthorizedException('Unauthorized access');
     }

     if (user?.role !== 'admin' && user?.role !== 'Administrator'){
      throw new UnauthorizedException('Unauthorize access');
     }
      const adminId = user.sub;

      const admin = await this.adminRepo.findOne({
        where:{id:adminId}
      });
      if(!admin){
        throw new NotFoundException('Admin does not exist');
      }
      const officers = await this.officerAccountRepo.find({
        select:['id','email','user_name','status']
      })
      return officers;
    }

    async getofficerAccountbyId(user:any,officerId:number):Promise<Partial<officeraccount>>{
      if(!user){
        throw new UnauthorizedException('Are you sure you are a admin?');
      }
      if(user?.role !== 'admin' && user?.role !== 'Administrator'){
        throw new UnauthorizedException('Unauthorized Access');
      }
      const officerAccount = await this.officerAccountRepo.findOne({
        where:{id:officerId}
      })
      if(!officerAccount){
        throw new NotFoundException('Officer Account does not exsist');
      }
      return officerAccount;
    }
}
  
