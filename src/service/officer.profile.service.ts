import {Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Not, Repository, TreeRepository} from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConflictException,NotFoundException} from '@nestjs/common';
import { CreateOfficerProfileDto } from 'src/officer_profile_dto/create.officer.profile.dto';
import {officerprofile} from 'src/entities/officerprofile.entity';
import {OfficerAccountService} from 'src/service/officer.account.service';
import { UpdateOfficerProfileDto } from 'src/officer_profile_dto/update.officer.profile.dto';


@Injectable()
export class OfficerProfileService{
    constructor(
        @InjectRepository(officerprofile)
        private readonly officerProfileRepo: Repository<officerprofile>,
        private readonly jwtService:JwtService,
        private readonly officerAccountService: OfficerAccountService,
    ){}

    

}