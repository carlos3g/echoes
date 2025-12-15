import { PrismaService } from '@app/lib/prisma/services/prisma.service';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { PRISMA_CLIENT_KEY, PrismaManagerService } from './prisma-manager.service';

const makeClsServiceMock = () => ({
  get: jest.fn(),
});

const makePrismaServiceMock = () => ({});

describe('PrismaManagerService', () => {
  let service: PrismaManagerService;
  let clsService: ClsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaManagerService,
        {
          provide: ClsService,
          useFactory: makeClsServiceMock,
        },
        {
          provide: PrismaService,
          useFactory: makePrismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<PrismaManagerService>(PrismaManagerService);
    clsService = module.get<ClsService>(ClsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getNativeClient', () => {
    it('should return the native PrismaService client', () => {
      const result = service.getNativeClient();

      expect(result).toBe(prismaService);
    });
  });

  describe('getClient', () => {
    it('should return the transaction PrismaClient if present', () => {
      const mockPrismaClient = makePrismaServiceMock();
      jest.spyOn(clsService, 'get').mockReturnValue(mockPrismaClient);

      const result = service.getClient();

      expect(result).toBe(mockPrismaClient);
      expect(clsService.get).toHaveBeenCalledWith(PRISMA_CLIENT_KEY);
    });

    it('should return the default PrismaService client if no transaction is present', () => {
      jest.spyOn(clsService, 'get').mockReturnValue(null);

      const result = service.getClient();

      expect(result).toBe(prismaService);
      expect(clsService.get).toHaveBeenCalledWith(PRISMA_CLIENT_KEY);
    });
  });
});
