import { Controller, Get } from '@nestjs/common';
// service lives in ../service folder
import { AppService } from '../service/app.service';

@Controller()
export class AppController{

  constructor(private appService: AppService){}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/testdb')
    async testDb() {
          return await this.appService.testDatabaseConnection();
      }
  
  
  }

  



