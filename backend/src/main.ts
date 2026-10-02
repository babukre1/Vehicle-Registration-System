import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app.module';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';

function validationMessages(errors: ValidationError[], parent = ''): string[] {
  return errors.flatMap((error) => {
    const field = parent ? `${parent}.${error.property}` : error.property;
    const own = Object.values(error.constraints ?? {}).map((message) => `${field}: ${message}`);
    return [...own, ...validationMessages(error.children ?? [], field)];
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ApiExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false,
    exceptionFactory: (errors) => new BadRequestException({
      message: 'Please correct the highlighted information and try again.',
      details: validationMessages(errors),
    }),
  }));
  app.enableCors({
    origin: (process.env.CORS_ORIGINS ?? 'https://vrs.abubakr.so,http://localhost:3000').split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // set to true only if you use cookies/auth headers
  });

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
