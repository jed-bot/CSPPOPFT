import { IsOptional, IsString, IsEmail, MinLength, MaxLength, IsIn } from 'class-validator';

export class UpdateAdminInfoDto{

    @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsString()
    email?:string;

         @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
    user_name?:string;



      @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(20, { message: 'Username cannot exceed 20 characters' })
    name?;string;

    @IsOptional()
  @IsString()
    department?:string;
}