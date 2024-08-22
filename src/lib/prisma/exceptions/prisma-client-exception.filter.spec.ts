import { PrismaClientErrorCode } from '@app/lib/prisma/enums';
import { PrismaClientExceptionFilter } from '@app/lib/prisma/exceptions/prisma-client-exception.filter';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const mockJson = jest.fn();

const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));

const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));

const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('PrismaClientExceptionFilter', () => {
  let service: PrismaClientExceptionFilter;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaClientExceptionFilter],
    }).compile();

    service = module.get<PrismaClientExceptionFilter>(PrismaClientExceptionFilter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('PrismaClientErrorCode.UniqueConstraintFailed', () => {
    const fakeEntity = faker.lorem.word();

    const error = new PrismaClientKnownRequestError('Prisma Client Error', {
      code: PrismaClientErrorCode.UniqueConstraintFailed,
      clientVersion: faker.string.numeric(3),
      meta: {
        target: [fakeEntity],
      },
    });

    service.catch(error, mockArgumentsHost);

    expect(mockHttpArgumentsHost).toHaveBeenCalledTimes(1);
    expect(mockHttpArgumentsHost).toHaveBeenCalledWith();
    expect(mockGetResponse).toHaveBeenCalledTimes(1);
    expect(mockGetResponse).toHaveBeenCalledWith();
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: `${fakeEntity} já existe`,
    });
  });

  it('PrismaClientErrorCode.RecordNotFound', () => {
    const error = new PrismaClientKnownRequestError('Prisma Client Error', {
      code: PrismaClientErrorCode.RecordNotFound,
      clientVersion: faker.string.numeric(3),
    });

    service.catch(error, mockArgumentsHost);

    expect(mockHttpArgumentsHost).toHaveBeenCalledTimes(1);
    expect(mockHttpArgumentsHost).toHaveBeenCalledWith();
    expect(mockGetResponse).toHaveBeenCalledTimes(1);
    expect(mockGetResponse).toHaveBeenCalledWith();
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledTimes(1);
  });
});
