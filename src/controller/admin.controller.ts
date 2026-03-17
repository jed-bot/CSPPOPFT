import { Controller, Get, Param, ParseIntPipe,Post,Body,ValidationPipe,Put ,UseGuards,Patch,Request,Delete} from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import { CreateAdminDto } from 'src/admin_dto/create.admin.dto';
import { LoginAdminDto } from 'src/admin_dto/login.admin.dto';
import { ForgotPasswordDto } from 'src/admin_dto/fogot.admin.dto';
import { DeleteAdminDto } from 'src/admin_dto/delete.admin.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller()
export class AdminController{

    constructor(private readonly adminService: AdminService){}


       // get admin info with bearer token
        @UseGuards(AuthGuard('jwt'))
        @Get('auth/admin/info')
        async getAdminInfo(@Request()req){
            return this.adminService.getAdmininfo(req.user.sub,req.user);
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
            console.log(req.user);
            return this.adminService.forgotPassword(dto,req.user);
        }

        //route for admin deletion 
        @UseGuards(AuthGuard('jwt'))
        @Delete('auth/admin/delete')
        async deleteAdmin(@Request()req,@Body()dto:DeleteAdminDto){
            return this.adminService.deleteAdmin(dto,req.user)
        }

}