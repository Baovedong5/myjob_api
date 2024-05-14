import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);

  //Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  //Guard
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  //intercepter
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  //config static file
  app.useStaticAssets(join(__dirname, '..', 'public'));

  //config helmet
  app.use(helmet());

  //config cookie
  app.use(cookieParser());

  //config cord
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });

  //config version
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
  });

  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
