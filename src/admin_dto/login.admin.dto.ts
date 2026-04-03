import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class LoginAdminDto{

         @IsEmail({}, { message: 'Valid email required' })
    email:string;

    @IsString()
      @MinLength(8)
    password:string;
}