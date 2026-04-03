import {Max, Min,IsEmail, IsString, IsOptional, MinLength, MaxLength, Matches, IsNumber, IsIn } from "class-validator";


export class UpdateOfficerBmiDto{
    @Min(0.5, { message: 'Height must be at least 0.5 meters' })
      @Max(2.5, { message: 'Height cannot exceed 2.5 meters' })
      height_meter: number;
    
      @IsNumber()
      @Min(20, { message: 'Weight must be at least 20 kg' })
      @Max(300, { message: 'Weight cannot exceed 300 kg' })
      weight_kg: number;
    
      @IsString()
          @IsString()
          @Matches(/^\d{4}-\d{2}-\d{2}$/,{ message: 'Use YYYY-MM-DD format' })
        month_taken:string;
}   