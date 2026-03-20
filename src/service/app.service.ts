import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource){}

  getHello(): string {
    return 'Hello World!';
  }

  async testDatabaseConnection(){
    try {
      if (this.dataSource.isInitialized){
        return{
          status: 'success',
          message: 'Database connection is successful',
        };
      }else{
        return{
          status: 'error',
          message: 'Error Occured',
        };
      }
    }catch(error){
      return{
        status: 'error',
        message: 'Error Occured',
      };
    }
  }
  
}
