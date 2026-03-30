import { Controller, Get, Param, ParseIntPipe,Post,Body,ValidationPipe,Put ,UseGuards,Patch,Request,Delete, Req} from '@nestjs/common';
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


@Controller()
export class AdminController{

    constructor(private readonly adminService: AdminService){}


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
        @Get('auth/admin/getallofficer_profile')
        async getallofficerprofile(@Request()req){
            return this.adminService.getallofficerprofile(req.user.sub);
        }

        @UseGuards(AuthGuard('jwt'))
        @Get('auth/admin/offcer_profile/:id')
        async getofficerprofileid(@Request()req, @Param('id') id:number){
            return this.adminService.getofficerprofilebyid(req.user.sub,id)
        }

        @UseGuards(AuthGuard('jwt'))
        @Put ('auth/admin/updateofficerprofile/:id')
        async updateofficerprofile(@Request()req,@Param('id') id:number,updateofficerprofileDto:UpdateOfficerProfileDto){
            return this.adminService.updateofficerprofile(updateofficerprofileDto,id,req.user.sub,req.user);
        }

        @UseGuards(AuthGuard('jwt'))
        @Delete('auth/admin/officer/deleteofficerprofile/:id')
        async deleteofficerprofile(@Request()req,@Param('id') id:number){
            return this.adminService.deleteofficerprofile(req.user.sub,req.user);
        }
}