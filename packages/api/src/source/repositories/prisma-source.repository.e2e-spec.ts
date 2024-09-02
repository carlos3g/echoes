import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { PrismaSourceRepository } from '@app/source/repositories/prisma-source.repository';
import { faker } from '@faker-js/faker';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { quoteFactory, sourceFactory } from '@test/factories';
import { prisma } from '@test/server';
import * as _ from 'lodash';

describe('PrismaSourceRepository', () => {
  let sourceRepository: PrismaSourceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaSourceRepository],
    }).compile();

    sourceRepository = module.get<PrismaSourceRepository>(PrismaSourceRepository);
  });

  describe('create', () => {
    it('should create new source', async () => {
      const quote = await prisma.quote.create({ data: quoteFactory() });

      const payload = { ...sourceFactory(), quoteId: Number(quote.id) };

      const result = await sourceRepository.create(payload);

      expect(result).toMatchObject(payload);
    });
  });

  describe('findUniqueOrThrow', () => {
    it('should find a source by id', async () => {
      const quote = await prisma.quote.create({ data: quoteFactory() });

      const createdSource = await prisma.source.create({
        data: { ...sourceFactory(), quoteId: quote.id },
      });

      const result = await sourceRepository.findUniqueOrThrow({
        where: { id: Number(createdSource.id) },
      });

      expect(result).toMatchObject({
        ...createdSource,
        id: Number(createdSource.id),
        quoteId: Number(createdSource.quoteId),
        uuid: createdSource.uuid,
      });
    });

    it('should find a source by uuid', async () => {
      const quote = await prisma.quote.create({ data: quoteFactory() });

      const createdSource = await prisma.source.create({
        data: { ...sourceFactory(), quoteId: quote.id },
      });

      const result = await sourceRepository.findUniqueOrThrow({
        where: { uuid: createdSource.uuid },
      });

      expect(result).toMatchObject({
        ...createdSource,
        id: Number(createdSource.id),
        quoteId: Number(createdSource.quoteId),
        uuid: createdSource.uuid,
      });
    });

    it('should throw an error if source not found', async () => {
      await expect(sourceRepository.findUniqueOrThrow({ where: { uuid: 'non-existent-uuid' } })).rejects.toThrow();
    });
  });

  describe('findMany', () => {
    it('should find many sources', async () => {
      const quote = await prisma.quote.create({ data: quoteFactory() });

      await prisma.source.createMany({
        data: _.range(30).map(() => ({ ...sourceFactory(), quoteId: quote.id })),
      });

      const result = await sourceRepository.findMany();

      expect(result).toHaveLength(30);
    });
  });

  describe('findManyPaginated', () => {
    it('should find many sources paginated', async () => {
      const quote = await prisma.quote.create({ data: quoteFactory() });

      await prisma.source.createMany({
        data: _.range(30).map(() => ({ ...sourceFactory(), quoteId: quote.id })),
      });

      const result = await sourceRepository.findManyPaginated({
        options: { page: 1, perPage: 10 },
      });

      expect(result.data).toHaveLength(10);
      expect(result.meta.total).toBe(30);
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.perPage).toBe(10);
      expect(result.meta.lastPage).toBe(3);
      expect(result.meta.prev).toBeNull();
      expect(result.meta.next).toBe(2);
    });
  });

  describe('update', () => {
    it('should update an existing source', async () => {
      const quote = await prisma.quote.create({ data: quoteFactory() });

      const createdSource = await prisma.source.create({
        data: { ...sourceFactory(), quoteId: quote.id },
      });

      const newTitle = faker.lorem.sentence();

      const result = await sourceRepository.update({
        where: { uuid: createdSource.uuid },
        data: { title: newTitle },
      });

      expect(result.title).toBe(newTitle);
    });
  });
});
