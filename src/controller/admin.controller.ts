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
import { UpdateOfficer1minPushupDto } from 'src/officer1min_push_dto/update.1min.pushup';
import { OfficerPftTestService } from 'src/service/officer.pft.test.service';
import { OfficerSprintTestService } from 'src/service/sprinttest.service';
import { AuroraMysqlConnection } from 'typeorm/driver/aurora-mysql/AuroraMysqlConnection.js';
import { UpdateSitUpDto } from 'src/officer_situp_1min/update.officer.1minsitup.dto';
import { Update300mTestDto } from 'src/300m_test_dto/update.300m.test.dto';
import { OfficerWalkTestService } from 'src/service/walk.test.service';
import { UpdateOfficerWalkDto } from 'src/walk_test_dto/update.officer.walk.test.dto';
import { AdminAuthKeyGuard } from 'src/auth/admin.auth.key.guard';


@Controller('auth/admin')
export class AdminController{

    constructor(
        private readonly adminService: AdminService,
        private readonly OfficerProfileService:OfficerAccountService,
        private readonly OfficerBmiSevice:OfficerProfileService,
        private readonly OfficerSitUpRepository:OfficerPftTestService,
        private readonly OfficerSprinttestRepository:OfficerSprintTestService,
        private readonly OfficerwalkRepository:OfficerWalkTestService,
    ){}


       // get admin info with bearer token
        @UseGuards(AuthGuard('jwt'))
        @Get('/info')
        async getAdminInfo(@Request()req){
            return this.adminService.getAdmininfo(req.user.sub,req.user);
        }

        //get Admin by Id
        @UseGuards(AuthGuard('jwt'))
        @Get('/info/:id')
        async getAdminById(@Param('id',ParseIntPipe)id:number,@Request()req){
            return this.adminService.getAdminInfoById(req.user,id)
        }
        //route for creating admin
        @UseGuards(AdminAuthKeyGuard)
        @Post('/signup')
            async createAdmin(@Body(new ValidationPipe()) createAdminDto: CreateAdminDto) {
                return this.adminService.createAdmin(createAdminDto)
            }
        //route for login admin
        @Post('/login')
            async loginAdmin(@Body(new ValidationPipe()) loginAdminDto:LoginAdminDto){
                return this.adminService.loginAdmin(loginAdminDto)
            }
        //route for forgot password
        @UseGuards(AuthGuard('jwt'))
        @Put('/forgot_password')
        async forgotPassword(@Request() req,@Body()dto:ForgotPasswordDto){
            return this.adminService.forgotPassword(dto,req.user);
        }

        //route for admin deletion 
        @UseGuards(AuthGuard('jwt'))
        @Delete('/delete')
        async deleteAdmin(@Request()req,@Body()dto:DeleteAdminDto){
            return this.adminService.deleteAdmin(dto,req.user)
        }
        //update admin status
        @UseGuards(AuthGuard('jwt'))
        @Put('/update/status')
            async updateAdminStatus(@Request()req,@Body()dto:AdminStatusDto){
                return this.adminService.updateAdminStatus(dto,req.user)
        }
        //update admin info 
        @UseGuards(AuthGuard('jwt'))
        @Put('/update/info')
        async updateAdminInfo(@Request()req,@Body()dto:UpdateAdminInfoDto){
            return this.adminService.updateAdminInfo(dto,req.user)
        }
        //update officer account status
        @UseGuards(AuthGuard('jwt'))
        @Put('/update/officer/status')
            async updateOfficerStatus(@Request()req,@Body()dto:UpdateOfficerStatus){
                return this.adminService.updateOfficerStatus(dto,req.user)
        }
        //get all officer accounts
        @UseGuards(AuthGuard('jwt'))
        @Get('/officer/accounts')
            async getAllOfficerAccount(@Param('id') id:number, @Request()req){
                return this.adminService.getAllofficerAccount(req.user)
            }
        //get officer account by id
        @UseGuards(AuthGuard('jwt'))
        @Get('/officer/account/:id')
            async getOfficerAccountById(@Param('id',ParseIntPipe)id:number,@Request()req){
                return this.adminService.getofficerAccountbyId(req.user,id)
            }

        @UseGuards(AuthGuard('jwt'))
        @Get('/officer/profile')
        async getallofficerpofile(@Request()req){
            return this.OfficerProfileService.getallofficerprofile(req.user.sub)
        }

        @UseGuards(AuthGuard('jwt'))
        @Get ('/officer/profile/:id')
        async getofficerprofilebyid(@Request()req,@Param('id')id:number){
            return this.OfficerProfileService.getofficerprofilebyid(req.user.sub,id)
        }

        @UseGuards(AuthGuard('jwt'))
        @Put ('/update/officerprofile/:id')
        async updateofficerprofile(@Request()req,@Body()updateofficerpfdto:UpdateOfficerProfileDto,@Param('id')id:number){
            return this.OfficerProfileService.UpdateOfficerProfile(req.user.sub,updateofficerpfdto,id)
        }

        @UseGuards(AuthGuard('jwt'))
        @Delete('/delete/officerprofile/:id')
        async deleteofficerprofile(@Request()req,@Param('id')id:number){
            return this.OfficerProfileService.deleteofficerprofile(req.user.sub,id)
        }

        @UseGuards(AuthGuard('jwt'))
        @Get ('/officer/get/officerbmi')
        async getallofficerbmi(@Request()req ){
            return this.OfficerBmiSevice.getallofficerbmi(req.user.sub)
        }

        @UseGuards(AuthGuard('jwt'))
        @Get('/officer/get/officerbmi/:id')
        async getofficerbmibyid(@Request()req,@Param('id')id:number){
            return this.OfficerBmiSevice.getofficerbmirecordbyid(id,req.user.sub)
        }
        @UseGuards(AuthGuard('jwt'))
        @Put('/officer/update/officerbmi/:id')
        async updateofficerbmireocrd(@Request()req,@Param('id')id:number,updateofficerbmidto:UpdateOfficerBmiDto){
            return this.OfficerBmiSevice.updateofficerbmi(id,req.user.sub,updateofficerbmidto,req.user)
        }

        @UseGuards(AuthGuard('jwt'))
        @Delete('/officer/delete/officerbmi/:id')
        async deleteofficerbmi(@Request()req,@Param('id')id:number){
            return this.OfficerBmiSevice.deletbmibyadmin(id,req.user.sub,req.user)
        }

        @UseGuards(AuthGuard('jwt'))
        @Get ('/officer/pushuprecord')
        async getallofficerpushuprecord(@Request()req){
              return this.OfficerBmiSevice.getallpushuprecord(req.user.sub,req.user);
        }

        @UseGuards(AuthGuard('jwt'))
        @Get('/officer/pushuprecord/:id')
        async getofficerpushuprecord(@Request()req,@Param('id') id:number){
            return this.OfficerBmiSevice.getofficerpushrecordbyid(req.user.sub,id,req.user)
        }

        @UseGuards(AuthGuard('jwt'))
        @Put ('/officer/update/pushuprecord/:id')
        async updateofficerpushuprecrd(@Request()req,@Param('id') id:number,@Body() updatedto:UpdateOfficer1minPushupDto){
            return this.OfficerBmiSevice.adminupdatepushup(req.user.sub,id,updatedto,req.user)
        }

        @UseGuards(AuthGuard('jwt'))
        @Delete('/officer/delete/pushuprecord/:id')
        async deleteofficerpushuprecord(@Request()req,@Param('id')id:number){
            return this.OfficerBmiSevice.deletepushupbyadmin(req.user.sub,id,req.user)
        }


        @UseGuards(AuthGuard('jwt'))
        @Get ('/officer/get/allsituprecord')
        async getallofficersituprecord(@Request()req){
            return this.OfficerSitUpRepository.getallsituprecordbyadmin(req.user.sub)
        }

        @UseGuards(AuthGuard('jwt'))
        @Get('/officer/get/situprecord/:id')
        async getofficersitup(@Request()req,@Param('id') id:number){
            return this.OfficerSitUpRepository.admingetsituprecordbyid(req.user.sub,id,req.user)
        }

        @UseGuards(AuthGuard('jwt'))
        @Put('/officer/update/situprecord/:id')
        async updateofficersituprecord(@Request()req,@Param('id') id:number,@Body() updateDto:UpdateSitUpDto){
            return this.OfficerSitUpRepository.updatesitupbyadmin(req.user.sub,id,updateDto,req.user)
        }

        @UseGuards(AuthGuard('jwt'))
        @Delete('/officer/delete/situprecord/:id')
        async deleteofficersituprecord(@Request()req,@Param('id') id:number){
            return this.OfficerSitUpRepository.deletesitupbyadmin(req.user.sub,id,req.user)
        }

        @UseGuards(AuthGuard('jwt'))
        @Get('/officer/get/allsprintrecords')
        async getallofficersprintrecord(@Request()req){
            return this.OfficerSprinttestRepository.getallofficersprintrecordbyadmin(req.user.sub,req.user)
        }

        @UseGuards(AuthGuard('jwt'))
        @Get ('/officer/get/sprintrecord/:id')
        async getofficerprintrecordbyid(@Request()req,@Param('id') id:number){
            return this.OfficerSprinttestRepository.getsprintrecordbyadmin(req.user.sub,id,req.user)
        }

        @UseGuards(AuthGuard('jwt'))
        @Put('/officer/update/sprintrecord/:id')
        async updateofficersprintrecord(@Request()req,@Param('id')id:number,@Body()updateDto:Update300mTestDto,user:any){
            return this.OfficerSprinttestRepository.updateofficersprintrecordadmin(updateDto,id,req.user.sub,req.user)
        }

        @UseGuards(AuthGuard('jwt'))
        @Delete('/officer/delete/sprintrecord/:id')
        async deleteofficersprintrecord(@Request()req,@Param('id')id:number){
            return this.OfficerSprinttestRepository.deletebyAdmin(req.user.sub,id,req.user)
        }
      

        @UseGuards(AuthGuard('jwt'))
        @Get('/officer/get/walktestrecord')
        async getallwalktestrecord(@Request()req){
            return this.OfficerwalkRepository.getalladminwalkrecord(req.user.sub,req.user)
        }

        @UseGuards(AuthGuard('jwt'))
        @Get('/officer/get/walktest/:id')
        async getwaltestrecord(@Request()req,@Param('id') id:number){
            return this.OfficerwalkRepository.admingetwalkrecordbyid(req.user.sub,id,req.user)
        }

        @UseGuards(AuthGuard('jwt'))
        @Put('/officer/update/walktest/:id')
        async updateofficerwalktrecord(@Request()req,@Param('id') id:number,@Body()updateDto:UpdateOfficerWalkDto){
            return this.OfficerwalkRepository.updatewalktestbyadmin(req.user.sub,id,updateDto,req.user)
        }

        @UseGuards(AuthGuard('jwt'))
        @Delete('/officer/delete/walktest/:id')
        async deleteofficerwalkrecord(@Request()req,@Param('id') id:number){
            return this.OfficerwalkRepository.deletebyAdmin(req.user.sub,id,req.user)
        }
}   