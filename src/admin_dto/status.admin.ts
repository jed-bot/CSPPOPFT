import { IsEmail, IsString, IsOptional, MinLength, MaxLength, Matches } from "class-validator";

export class AdminStatusDto{
    email:string;
    password:string;
    status:string;
}