import { PrismaAuthorRepository } from '@app/author/repositories/prisma-author.repository';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { faker } from '@faker-js/faker';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { authorFactory, userFactory } from '@test/factories';
import { prisma } from '@test/server';
import * as _ from 'lodash';

const createAuthorsFavorited = async (args: { userId: number; count: number }) => {
  const { userId, count } = args;

  const authors = await prisma.author.createManyAndReturn({
    data: _.range(count).map(authorFactory),
  });

  const promises = authors.map((author) =>
    prisma.author.update({
      data: {
        favoritedBy: {
          create: { userId },
        },
      },
      where: { uuid: author.uuid },
    })
  );

  await Promise.all(promises);

  return authors;
};

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
        where: { id: Number(createdAuthor.id) },
      });

      expect(result).toMatchObject({
        ...createdAuthor,
        id: Number(createdAuthor.id),
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
        id: Number(createdAuthor.id),
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

  describe('findManyFavoritedByUser', () => {
    it('should find authors favorited by a specific user', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      await prisma.author.createMany({
        data: _.range(5).map(authorFactory),
      });

      const authors = await createAuthorsFavorited({
        userId: Number(user.id),
        count: 5,
      });

      const result = await authorRepository.findManyFavoritedByUser({
        where: { userId: Number(user.id) },
      });

      const favoritedAuthorsUuid = authors.map((author) => author.uuid);

      expect(result).toHaveLength(5);
      result.forEach((author) => {
        expect(favoritedAuthorsUuid).toContain(author.uuid);
      });
    });

    it('should return an empty array if the user has no favorited authors', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      await prisma.author.createMany({
        data: _.range(5).map(authorFactory),
      });

      const result = await authorRepository.findManyFavoritedByUser({
        where: { userId: Number(user.id) },
      });

      expect(result).toEqual([]);
    });
  });

  describe.skip('findManyByTag', () => {});

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

  describe('favorite', () => {
    it('should favorite an quote', async () => {
      const author = await prisma.author.create({
        data: authorFactory(),
      });

      const user = await prisma.user.create({
        data: userFactory(),
      });

      await authorRepository.favorite({
        data: { userId: Number(user.id), authorId: Number(author.id) },
      });

      const relation = await prisma.userFavoriteAuthor.findFirst({
        where: {
          userId: Number(user.id),
          authorId: Number(author.id),
        },
      });

      expect(relation).toBeDefined();
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
