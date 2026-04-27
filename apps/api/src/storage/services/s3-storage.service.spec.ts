import type { EnvVariables } from '@app/shared/types';
import { Uint8ArrayToBuffer } from '@app/shared/utils';
import type { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { S3StorageService } from './s3-storage.service';

jest.mock('@app/shared/utils', () => ({
  Uint8ArrayToBuffer: jest.fn().mockImplementation((input: Uint8Array) => Buffer.from(input)),
}));

const makeConfigServiceMock = () => ({
  getOrThrow: jest.fn((key: keyof EnvVariables) => {
    const config = {
      AWS_ACCESS_KEY_ID: faker.lorem.word(),
      AWS_SECRET_ACCESS_KEY: faker.lorem.word(),
      AWS_REGION: faker.lorem.word(),
      AWS_ENDPOINT: faker.internet.url(),
    } as Record<keyof EnvVariables, string>;

    return config[key];
  }),
});

describe('S3StorageService', () => {
  let service: S3StorageService;
  const s3Mock = mockClient(S3Client);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3StorageService,
        {
          provide: ConfigService,
          useFactory: makeConfigServiceMock,
        },
      ],
    }).compile();

    service = module.get<S3StorageService>(S3StorageService);
  });

  afterEach(() => {
    s3Mock.reset();
  });

  describe('get', () => {
    it('should retrieve an object from S3', async () => {
      const mockData = new Uint8Array([116, 101, 115, 116]);

      s3Mock.on(GetObjectCommand).resolves({
        Body: {
          transformToByteArray: jest.fn().mockResolvedValue(mockData),
        },
      } as unknown as GetObjectCommandOutput);

      const payload = {
        bucket: faker.lorem.word(),
        key: faker.lorem.word(),
      };

      const result = await service.get(payload);

      expect(Uint8ArrayToBuffer).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(Buffer.from(mockData));
      expect(s3Mock).toHaveReceivedCommandWith(GetObjectCommand, {
        Bucket: payload.bucket,
        Key: payload.key,
      });
    });
  });

  describe('set', () => {
    it('should put an object into S3', async () => {
      s3Mock.on(PutObjectCommand).resolves({});

      const payload = {
        bucket: faker.lorem.word(),
        key: faker.lorem.word(),
        value: Buffer.from(faker.lorem.word()),
      };

      const result = await service.set(payload);

      expect(result).toEqual({ key: payload.key });
      expect(s3Mock).toHaveReceivedCommandWith(PutObjectCommand, {
        Bucket: payload.bucket,
        Key: payload.key,
        Body: payload.value,
      });
    });
  });

  describe('delete', () => {
    it('should delete an object from S3', async () => {
      s3Mock.on(DeleteObjectCommand).resolves({});

      const payload = {
        bucket: faker.lorem.word(),
        key: faker.lorem.word(),
      };

      await service.delete(payload);

      expect(s3Mock).toHaveReceivedCommandWith(DeleteObjectCommand, {
        Bucket: payload.bucket,
        Key: payload.key,
      });
    });
  });
});
