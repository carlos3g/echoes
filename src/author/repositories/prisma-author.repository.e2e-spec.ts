import { PrismaAuthorRepository } from '@app/author/repositories/prisma-author.repository';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { faker } from '@faker-js/faker';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { authorFactory } from '@test/factories';
import { prisma } from '@test/server';
import * as _ from 'lodash';

describe('PrismaAuthorRepository', () => {
  let authorRepository: PrismaAuthorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaAuthorRepository],
    }).compile();

    authorRepository = module.get<PrismaAuthorRepository>(PrismaAuthorRepository);
  });

  describe('create', () => {
    it('should create new author', async () => {
      const payload = authorFactory();

      const result = await authorRepository.create(payload);

      expect(result).toMatchObject(payload);
    });
  });

  describe('findUniqueOrThrow', () => {
    it('should find a author by id', async () => {
      const createdAuthor = await prisma.author.create({
        data: authorFactory(),
      });

      const result = await authorRepository.findUniqueOrThrow({
        where: { uuid: createdAuthor.uuid },
      });

      expect(result).toMatchObject({
        ...createdAuthor,
        uuid: createdAuthor.uuid,
      });
    });

    it('should find a author by uuid', async () => {
      const createdAuthor = await prisma.author.create({
        data: authorFactory(),
      });

      const result = await authorRepository.findUniqueOrThrow({
        where: { uuid: createdAuthor.uuid },
      });

      expect(result).toMatchObject({
        ...createdAuthor,
        uuid: createdAuthor.uuid,
      });
    });

    it('should throw an error if author not found', async () => {
      await expect(authorRepository.findUniqueOrThrow({ where: { uuid: 'non-existent-uuid' } })).rejects.toThrow();
    });
  });

  describe('findMany', () => {
    it('should find many authors', async () => {
      await prisma.author.createMany({
        data: _.range(30).map(authorFactory),
      });

      const result = await authorRepository.findMany();

      expect(result).toHaveLength(30);
    });
  });

  describe('findManyPaginated', () => {
    it('should find many authors paginated', async () => {
      await prisma.author.createMany({
        data: _.range(30).map(authorFactory),
      });

      const result = await authorRepository.findManyPaginated({
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
    it('should update an existing author', async () => {
      const createdAuthor = await prisma.author.create({
        data: authorFactory(),
      });

      const newBio = faker.lorem.sentence();

      const result = await authorRepository.update({
        where: { uuid: createdAuthor.uuid },
        data: { bio: newBio },
      });

      expect(result.bio).toBe(newBio);
    });
  });

  describe('delete', () => {
    it('should delete an existing author', async () => {
      const createdAuthor = await prisma.author.create({
        data: authorFactory(),
      });

      await authorRepository.delete({
        where: { uuid: createdAuthor.uuid },
      });

      await expect(prisma.author.findUniqueOrThrow({ where: { uuid: createdAuthor.uuid } })).rejects.toThrow();
    });

    it('should delete only the author passed', async () => {
      await prisma.author.createMany({
        data: _.range(5).map(authorFactory),
      });
      const createdAuthor = await prisma.author.create({
        data: authorFactory(),
      });

      await authorRepository.delete({ where: { uuid: createdAuthor.uuid } });

      await expect(prisma.author.count()).resolves.toBe(5);
    });
  });
});
