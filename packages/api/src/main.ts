import type { Server } from 'net';
import type { EnvVariables } from '@app/shared/types';
import type { INestApplication } from '@nestjs/common';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as qs from 'qs';
import { AppModule } from './app.module';

const DEFAULT_API_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create<INestApplication<Server>>(AppModule);

  const configService = app.get<ConfigService<EnvVariables>>(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Echoes - API')
    .setDescription('Citações')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(helmet());
  app.enableCors();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app
    .getHttpAdapter()
    .getInstance()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .set('query parser', (str: string) => qs.parse(str));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(configService.get('API_PORT') || DEFAULT_API_PORT);
}

void bootstrap();
