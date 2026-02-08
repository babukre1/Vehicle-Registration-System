import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'vehicle-registration-system-backend-oqou0cexz.vercel.app', // your Next.js app
    // origin: true, // your Next.js app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // set to true only if you use cookies/auth headers
  });

  app.enableCors();
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();