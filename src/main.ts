import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import {ValidationPipe} from '@nestjs/common';
import { listenerCount } from 'process';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //enable validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist:false,
    forbidNonWhitelisted:false,
    transform:true,
  }))
    await app.listen(process.env.PORT ?? 3000);
    console.log('App is listening on port 3000');
}
bootstrap();
