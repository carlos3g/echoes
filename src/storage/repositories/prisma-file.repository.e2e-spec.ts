import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { PrismaFileRepository } from '@app/storage/repositories/prisma-file.repository';
import { faker } from '@faker-js/faker';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { fileFactory } from '@test/factories';
import { prisma } from '@test/server';

describe('PrismaFileRepository', () => {
  let fileRepository: PrismaFileRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaFileRepository],
    }).compile();

    fileRepository = module.get<PrismaFileRepository>(PrismaFileRepository);
  });

  describe('create', () => {
    it('should create new file', async () => {
      const payload = fileFactory();

      const result = await fileRepository.create(payload);

      expect(result).toMatchObject(payload);
    });
  });

  describe('findUniqueOrThrow', () => {
    it('should find a file by id', async () => {
      const createdFile = await prisma.file.create({
        data: fileFactory(),
      });

      const result = await fileRepository.findUniqueOrThrow({
        where: { id: Number(createdFile.id) },
      });

      expect(result).toMatchObject({
        ...createdFile,
        id: Number(createdFile.id),
      });
    });

    it('should throw an error if file not found', async () => {
      await expect(fileRepository.findUniqueOrThrow({ where: { id: faker.number.int() } })).rejects.toThrow();
    });
  });
});
