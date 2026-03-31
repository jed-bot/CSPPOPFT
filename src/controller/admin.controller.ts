import { Controller, Get, Param, ParseIntPipe,Post,Body,ValidationPipe,Put ,UseGuards,Patch,Request,Delete, Req, ParseArrayPipe} from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import { CreateAdminDto } from 'src/admin_dto/create.admin.dto';
import { LoginAdminDto } from 'src/admin_dto/login.admin.dto';
import { ForgotPasswordDto } from 'src/admin_dto/fogot.admin.dto';
import { DeleteAdminDto } from 'src/admin_dto/delete.admin.dto';
import { AdminStatusDto } from 'src/admin_dto/status.admin';
import { AuthGuard } from '@nestjs/passport';
import { UpdateOfficerStatus } from 'src/officer_account_dto/update.officer.profile.dto';
import { UpdateAdminInfoDto } from 'src/admin_dto/update.admin.info';
import { UpdateOfficerProfileDto } from 'src/officer_profile_dto/update.officer.profile.dto';
import { UpdateOfficerBmiDto } from 'src/officer_bmi_dto/update.officer.bmi.dto';
import { OfficerAccountService } from 'src/service/officer.account.service';
import { OfficerProfileService } from 'src/service/officer.profile.service';


@Controller()
export class AdminController{

    constructor(
        private readonly adminService: AdminService,
        private readonly OfficerProfileService:OfficerAccountService,
        private readonly OfficerBmiSevice:OfficerProfileService
    ){}


       // get admin info with bearer token
        @UseGuards(AuthGuard('jwt'))
        @Get('auth/admin/info')
        async getAdminInfo(@Request()req){
            return this.adminService.getAdmininfo(req.user.sub,req.user);
        }

        //get Admin by Id
        @UseGuards(AuthGuard('jwt'))
        @Get('auth/admin/info/:id')
        async getAdminById(@Param('id',ParseIntPipe)id:number,@Request()req){
            return this.adminService.getAdminInfoById(req.user,id)
        }
        //route for creating admin
        @Post('auth/admin/signup')
            async createAdmin(@Body(new ValidationPipe()) createAdminDto: CreateAdminDto) {
                return this.adminService.createAdmin(createAdminDto)
            }
        //route for login admin
        @Post('auth/admin/login')
            async loginAdmin(@Body(new ValidationPipe()) loginAdminDto:LoginAdminDto){
                return this.adminService.loginAdmin(loginAdminDto)
            }
        //route for forgot password
        @UseGuards(AuthGuard('jwt'))
        @Put('auth/admin/forgot_password')
        async forgotPassword(@Request() req,@Body()dto:ForgotPasswordDto){
            return this.adminService.forgotPassword(dto,req.user);
        }

        //route for admin deletion 
        @UseGuards(AuthGuard('jwt'))
        @Delete('auth/admin/delete')
        async deleteAdmin(@Request()req,@Body()dto:DeleteAdminDto){
            return this.adminService.deleteAdmin(dto,req.user)
        }
        //update admin status
        @UseGuards(AuthGuard('jwt'))
        @Put('auth/admin/update_status')
            async updateAdminStatus(@Request()req,@Body()dto:AdminStatusDto){
                return this.adminService.updateAdminStatus(dto,req.user)
        }
        //update admin info 
        @UseGuards(AuthGuard('jwt'))
        @Put('auth/admin/update_info')
        async updateAdminInfo(@Request()req,@Body()dto:UpdateAdminInfoDto){
            return this.adminService.updateAdminInfo(dto,req.user)
        }
        //update officer account status
        @UseGuards(AuthGuard('jwt'))
        @Put('auth/admin/update_officer_status')
            async updateOfficerStatus(@Request()req,@Body()dto:UpdateOfficerStatus){
                return this.adminService.updateOfficerStatus(dto,req.user)
        }
        //get all officer accounts
        @UseGuards(AuthGuard('jwt'))
        @Get('auth/admin/officer_accounts')
            async getAllOfficerAccount(@Param('id') id:number, @Request()req){
                return this.adminService.getAllofficerAccount(req.user)
            }
        //get officer account by id
        @UseGuards(AuthGuard('jwt'))
        @Get('auth/admin/officer_account/:id')
            async getOfficerAccountById(@Param('id',ParseIntPipe)id:number,@Request()req){
                return this.adminService.getofficerAccountbyId(req.user,id)
            }

        @UseGuards(AuthGuard('jwt'))
        @Get('auth/admin/officerprofile')
        async getallofficerpofile(@Request()req){
            return this.OfficerProfileService.getallofficerprofile(req.user.sub)
        }

        @UseGuards(AuthGuard('jwt'))
        @Get ('auth/admin/officerprofile/:id')
        async getofficerprofilebyid(@Request()req,@Param('id')id:number){
            return this.OfficerProfileService.getofficerprofilebyid(req.user.sub,id)
        }

        @UseGuards(AuthGuard('jwt'))
        @Put ('auth/admin/editofficerprofile/:id')
        async updateofficerprofile(@Request()req,@Body()updateofficerpfdto:UpdateOfficerProfileDto,@Param('id')id:number){
            return this.OfficerProfileService.UpdateOfficerProfile(req.user.sub,updateofficerpfdto,id)
        }

        @UseGuards(AuthGuard('jwt'))
        @Delete('auth/admin/deleteofficerprofile/:id')
        async deleteofficerprofile(@Request()req,@Param('id')id:number){
            return this.OfficerProfileService.deleteofficerprofile(req.user.sub,id)
        }

        @UseGuards(AuthGuard('jwt'))
        @Get ('auth/admin/officer/getofficerbmi')
        async getallofficerbmi(@Request()req ){
            return this.OfficerBmiSevice.getallofficerbmi(req.user.sub,)
        }

        @UseGuards(AuthGuard('jwt'))
        @Get ('auth/admin/officer/getofficerbmi/:id')
        async getofficerbmibyid(@Request()req,@Param('id') id:number){
            return this.OfficerBmiSevice.getofficerbmirecordbyid(req.user.sub,id)
        }

        @UseGuards(AuthGuard('jwt'))
        @Put('auth/admin/officer/updateofficerbmi/:id')
        async updateofficerbmireocrd(@Request()req,@Param('id')id:number,updateofficerbmidto:UpdateOfficerBmiDto){
            return this.OfficerBmiSevice.updateOfficerBmi(req.user.sub,updateofficerbmidto,req.user,id)
        }

        @UseGuards(AuthGuard('jwt'))
        @Delete('auth/admin/officer/deleteofficerbmi/:id')
        async deleteofficerbmi(@Request()req,@Param('id')id:number){
            return this.OfficerBmiSevice.deleteOfficerBmi(req.user.sub,req.user,id)
        }

        @UseGuards(AuthGuard('jwt'))
        @Get ('auth/admin/officerpushuprecord')
        async getallofficerpushuprecord(@Request()req){
            return this.OfficerBmiSevice.getallpushuprecord(req.user.sub)
        }
      
}   