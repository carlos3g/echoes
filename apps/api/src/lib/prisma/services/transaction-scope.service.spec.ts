import { PRISMA_CLIENT_KEY, PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { PrismaTransactionScopeService } from '@app/lib/prisma/services/transaction-scope.service';
import { Logger } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { PrismaClient } from '@prisma/client';
import { ClsService } from 'nestjs-cls';

const makePrismaManagerServiceMock = () => ({
  getNativeClient: jest.fn(),
});

const makePrismaClientMock = () =>
  ({
    $transaction: jest.fn(),
  }) as unknown as PrismaClient;

const makeClsServiceMock = () => ({
  run: jest.fn(),
  set: jest.fn(),
});

describe('PrismaTransactionScopeService', () => {
  let service: PrismaTransactionScopeService;
  let prismaManagerService: PrismaManagerService;
  let clsService: ClsService;
  let mockPrismaClient: PrismaClient;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaTransactionScopeService,
        {
          provide: PrismaManagerService,
          useFactory: makePrismaManagerServiceMock,
        },
        {
          provide: ClsService,
          useFactory: makeClsServiceMock,
        },
        Logger,
      ],
    }).compile();

    service = module.get<PrismaTransactionScopeService>(PrismaTransactionScopeService);
    prismaManagerService = module.get<PrismaManagerService>(PrismaManagerService);
    clsService = module.get<ClsService>(ClsService);
    logger = module.get<Logger>(Logger);
    mockPrismaClient = makePrismaClientMock();

    (prismaManagerService.getNativeClient as jest.Mock).mockReturnValue(mockPrismaClient);
  });

  describe('run', () => {
    it('should execute the callback within a transaction and handle errors', async () => {
      const mockResult = 'mockResult';
      const mockCallback = jest.fn().mockResolvedValue(mockResult);

      (mockPrismaClient.$transaction as jest.Mock).mockImplementation((fn: (prisma: PrismaClient) => unknown) =>
        fn(mockPrismaClient)
      );

      (clsService.run as jest.Mock).mockImplementation((fn: () => unknown) => fn());

      const result = await service.run(mockCallback);

      expect(mockPrismaClient.$transaction).toHaveBeenCalled();
      expect(clsService.set).toHaveBeenCalledWith(PRISMA_CLIENT_KEY, mockPrismaClient);
      expect(mockCallback).toHaveBeenCalled();
      expect(result).toBe(mockResult);
      expect(clsService.set).toHaveBeenCalledWith(PRISMA_CLIENT_KEY, undefined);
    });

    it('should log and rethrow errors from the callback', async () => {
      const mockError = new Error('Test error');
      const mockCallback = jest.fn().mockRejectedValue(mockError);

      (mockPrismaClient.$transaction as jest.Mock).mockImplementation((fn: (prisma: PrismaClient) => unknown) =>
        fn(mockPrismaClient)
      );

      (clsService.run as jest.Mock).mockImplementation((fn: () => unknown) => fn());
      jest.spyOn(logger, 'error').mockImplementation();

      await expect(service.run(mockCallback)).rejects.toThrow(mockError);

      expect(clsService.set).toHaveBeenCalledWith(PRISMA_CLIENT_KEY, undefined);
    });
  });
});
