import {Max, Min,IsEmail, IsString, IsOptional, MinLength, MaxLength, Matches, IsNumber, IsIn } from "class-validator";

export class UpdateOfficerWalkDto{

    @IsString()
    @IsOptional()
    @IsIn(['male','female'])
    gender: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(60)
    minutes: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Max(59)
    seconds: number;

    @IsString()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/,{ message: 'Use YYYY-MM-DD format' })
    test_date: string;

    @IsNumber()
    @IsOptional()
    @Min(21)
    @Max(120)
    age: number;
}