import { Optional } from "@nestjs/common";
import { IsEmail, IsString, IsOptional, MinLength, MaxLength, Matches } from "class-validator";

export class CreateAdminDto{
@IsEmail()
 email:string;
@IsString()
@MinLength(8)
@MaxLength(100)
@Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, {
        message: 'Password contains invalid characters',
})
 password:string;
@IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'User name can only contain letters, numbers, and underscores',
  }) 
  @Optional()
  @IsString()
  @MaxLength(50)
  user_name:string;

 @IsOptional()
  @IsString()
  @MaxLength(50)
  role?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;
}