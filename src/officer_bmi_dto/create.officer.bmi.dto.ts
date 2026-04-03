import {Max, Min,IsEmail, IsString, IsOptional, MinLength, MaxLength, Matches, IsNumber, IsIn } from "class-validator";
export class CreateOfficerBmiDto{
@IsNumber()
  
  height_meter: number;

  @IsNumber()

  weight_kg: number;

  @IsString()
      @IsString()
      @Matches(/^\d{4}-\d{2}-\d{2}$/,{ message: 'Use YYYY-MM-DD format' })
    month_taken:string;

}