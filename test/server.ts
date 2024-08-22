/* eslint-disable import/no-mutable-exports */
import { AppModule } from '@app/app.module';
import { PrismaService } from '@app/lib/prisma/services/prisma.service';
import type { INestApplication } from '@nestjs/common';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import type { Server } from 'net';

const createTestingModule = async () => {
  const moduleFixture = Test.createTestingModule({
    imports: [AppModule],
  });

  const compiled = await moduleFixture.compile();

  const app = compiled.createNestApplication<INestApplication<Server>>();

  return app;
};

const getApplication = async () => {
  const app = await createTestingModule();

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  return app;
};

// see: https://github.com/nestjs/nest/issues/13191#issuecomment-1938178694
export let app: INestApplication<Server>;
export let server: Server;
export let prisma: PrismaService;

beforeAll(async () => {
  app = await getApplication();
  server = app.getHttpServer();
  prisma = app.get<PrismaService>(PrismaService);

  await app.init();
});

beforeEach(async () => {
  await prisma.clearDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
  server.close();
});
