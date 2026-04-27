import type { Server } from 'net';
import { AppModule } from '@app/app.module';
import { EmailServiceContract } from '@app/email/contracts/email-service.contract';
import { PrismaService } from '@app/lib/prisma/services/prisma.service';
import { StorageServiceContract } from '@app/storage/contracts/storage-service.contract';
import type { INestApplication } from '@nestjs/common';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as qs from 'qs';

export const emailServiceMock = {
  send: jest.fn().mockResolvedValue(undefined),
};

// AWS SDK middleware uses dynamic imports that don't work in Jest's CJS runtime
// (ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG). Stubbing avoids the issue and keeps
// e2e tests focused on app behavior, not S3 transport.
export const storageServiceMock = {
  get: jest.fn().mockResolvedValue(Buffer.from('')),
  set: jest.fn().mockImplementation(({ key }: { key: string }) => Promise.resolve({ key })),
  delete: jest.fn().mockResolvedValue(undefined),
};

const createTestingModule = async () => {
  const moduleFixture = Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(EmailServiceContract)
    .useValue(emailServiceMock)
    .overrideProvider(StorageServiceContract)
    .useValue(storageServiceMock);

  const compiled = await moduleFixture.compile();

  const app = compiled.createNestApplication<INestApplication<Server>>();

  return app;
};

const getApplication = async () => {
  const app = await createTestingModule();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app
    .getHttpAdapter()
    .getInstance()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .set('query parser', (str: string) => qs.parse(str));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

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
  emailServiceMock.send.mockClear();
  storageServiceMock.get.mockClear();
  storageServiceMock.set.mockClear();
  storageServiceMock.delete.mockClear();
});

afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
  server.close();
});
