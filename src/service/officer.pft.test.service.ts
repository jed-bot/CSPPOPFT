import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { officerprofile } from 'src/entities/officerprofile.entity';
import {officersitup1min} from 'src/entities/officersitup1min.entity';
import { CreateSitUpDto } from 'src/officer_situp_1min/create.officer.1minsitup.dto';
import { Repository } from 'typeorm';

@Injectable()
export class OfficerPftTestService{
    constructor(
        @InjectRepository(officersitup1min)
        private readonly officersitupTest: Repository<officersitup1min>,
        @InjectRepository(officerprofile)
        private readonly officerProfileRepository:Repository<officerprofile>,
    ){}
    async createofficer1minstup(createDto:CreateSitUpDto,accountId:number,user:any ):Promise<{message:string}>{
        if(user?.sub ! == accountId){
            throw new UnauthorizedException('Unauthoried Access');
        }
        const officerProfile = await this.officerProfileRepository.findOne({
            where:{officer_account_id:accountId}
        })

        if(!officerProfile){
            throw new NotFoundException('Account not foound');
        }

        const profileId = officerProfile.id;
        const createsitUp  = this.officersitupTest.create({
            officer_id: officerProfile.id,
            age: createDto.age,
            gender_type: createDto.gender_type,
            reps: createDto.reps,
            test_date: createDto.test_date,
        })
        await this.officersitupTest.save(createsitUp)
        return{
            message:'Added the bmi successfully'
        }
    }
}