import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class ForgotPasswordDto{
     @IsEmail({}, { message: 'Valid email required' })
    email:string;
    @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'Password must contain at least 1 letter and 1 number'
  })
    newpassword:string;
}