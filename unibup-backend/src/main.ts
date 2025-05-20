import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ErrorResponseInterceptor } from './common/interceptors/error-response.interceptor';
import { RpcCustomExceptionFilter } from './common/filters/rpc-exception.filter';
import validationOptions from './common/utils/validation-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  
  // Set the global pipes
  app.useGlobalInterceptors(new ErrorResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalFilters(new RpcCustomExceptionFilter());

  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Server running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
