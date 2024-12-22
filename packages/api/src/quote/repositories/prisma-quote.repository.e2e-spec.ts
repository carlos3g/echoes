import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { PrismaQuoteRepository } from '@app/quote/repositories/prisma-quote.repository';
import { faker } from '@faker-js/faker';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { quoteFactory, tagFactory, userFactory } from '@test/factories';
import { prisma } from '@test/server';
import * as _ from 'lodash';

const createQuotesFavorited = async (args: { userId: number; count: number }) => {
  const { userId, count } = args;

  const quotes = await prisma.quote.createManyAndReturn({
    data: _.range(count).map(quoteFactory),
  });

  const promises = quotes.map((quote) =>
    prisma.quote.update({
      data: {
        favoritedBy: {
          create: { userId },
        },
      },
      where: { uuid: quote.uuid },
    })
  );

  await Promise.all(promises);

  return quotes;
};

const createQuotesTagged = async (args: { tagId: number; count: number }) => {
  const { tagId, count } = args;

  const quotes = await prisma.quote.createManyAndReturn({
    data: _.range(count).map(quoteFactory),
  });

  const promises = quotes.map((quote) =>
    prisma.quote.update({
      data: {
        tags: {
          create: { tagId },
        },
      },
      where: { uuid: quote.uuid },
    })
  );

  await Promise.all(promises);

  return quotes;
};

describe('PrismaQuoteRepository', () => {
  let quoteRepository: PrismaQuoteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaQuoteRepository],
    }).compile();

    quoteRepository = module.get<PrismaQuoteRepository>(PrismaQuoteRepository);
  });

  describe('create', () => {
    it('should create new quote', async () => {
      const payload = quoteFactory();

      const result = await quoteRepository.create(payload);

      expect(result).toMatchObject(payload);
    });
  });

  describe('findUniqueOrThrow', () => {
    it('should find a quote by id', async () => {
      const createdQuote = await prisma.quote.create({
        data: quoteFactory(),
      });

      const result = await quoteRepository.findUniqueOrThrow({
        where: { id: Number(createdQuote.id) },
      });

      expect(result).toMatchObject({
        ...createdQuote,
        id: Number(createdQuote.id),
        uuid: createdQuote.uuid,
      });
    });

    it('should find a quote by uuid', async () => {
      const createdQuote = await prisma.quote.create({
        data: quoteFactory(),
      });

      const result = await quoteRepository.findUniqueOrThrow({
        where: { uuid: createdQuote.uuid },
      });

      expect(result).toMatchObject({
        ...createdQuote,
        id: Number(createdQuote.id),
        uuid: createdQuote.uuid,
      });
    });

    it('should throw an error if quote not found', async () => {
      await expect(quoteRepository.findUniqueOrThrow({ where: { uuid: 'non-existent-uuid' } })).rejects.toThrow();
    });
  });

  describe('findMany', () => {
    it('should find many quotes', async () => {
      await prisma.quote.createMany({
        data: _.range(30).map(quoteFactory),
      });

      const result = await quoteRepository.findMany();

      expect(result).toHaveLength(30);
    });
  });

  describe('findManyFavoritedByUser', () => {
    it('should find quotes favorited by a specific user', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      await prisma.quote.createMany({
        data: _.range(5).map(quoteFactory),
      });

      const quotes = await createQuotesFavorited({
        userId: Number(user.id),
        count: 5,
      });

      const result = await quoteRepository.findManyFavoritedByUser({
        where: { userId: Number(user.id) },
      });

      const favoritedQuotesUuid = quotes.map((quote) => quote.uuid);

      expect(result).toHaveLength(5);
      result.forEach((quote) => {
        expect(favoritedQuotesUuid).toContain(quote.uuid);
      });
    });

    it('should return an empty array if the user has no favorited quotes', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      await prisma.quote.createMany({
        data: _.range(5).map(quoteFactory),
      });

      const result = await quoteRepository.findManyFavoritedByUser({
        where: { userId: Number(user.id) },
      });

      expect(result).toEqual([]);
    });
  });

  describe('findManyByTag', () => {
    it('should find quotes by tag', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      const tag = await prisma.tag.create({
        data: {
          ...tagFactory(),
          userId: Number(user.id),
        },
      });

      await prisma.quote.createMany({
        data: _.range(5).map(quoteFactory),
      });

      const quotes = await createQuotesTagged({
        tagId: Number(tag.id),
        count: 5,
      });

      const result = await quoteRepository.findManyByTag({
        where: { tagId: Number(tag.id) },
      });

      const quotesTaggedUuid = quotes.map((quote) => quote.uuid);

      expect(result).toHaveLength(5);
      result.forEach((quote) => {
        expect(quotesTaggedUuid).toContain(quote.uuid);
      });
    });

    it('should return an empty array if the tag has no quotes', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      const tag = await prisma.tag.create({
        data: {
          ...tagFactory(),
          userId: Number(user.id),
        },
      });

      await prisma.quote.createMany({
        data: _.range(5).map(quoteFactory),
      });

      const result = await quoteRepository.findManyByTag({
        where: { tagId: Number(tag.id) },
      });

      expect(result).toEqual([]);
    });
  });

  describe('findManyPaginated', () => {
    it('should find many quotes paginated', async () => {
      await prisma.quote.createMany({
        data: _.range(30).map(quoteFactory),
      });

      const result = await quoteRepository.findManyPaginated({
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
    it('should update an existing quote', async () => {
      const createdQuote = await prisma.quote.create({
        data: quoteFactory(),
      });

      const newBody = faker.lorem.sentence();

      const result = await quoteRepository.update({
        where: { uuid: createdQuote.uuid },
        data: { body: newBody },
      });

      expect(result.body).toBe(newBody);
    });
  });

  describe('isTagged', () => {
    it('should return true if the quote is tagged', async () => {
      const [user, quote] = await Promise.all([
        prisma.user.create({ data: userFactory() }),
        prisma.quote.create({ data: quoteFactory() }),
      ]);

      const tag = await prisma.tag.create({
        data: {
          ...tagFactory(),
          userId: Number(user.id),
        },
      });

      await prisma.tagQuote.create({
        data: {
          quoteId: Number(quote.id),
          tagId: Number(tag.id),
        },
      });

      const result = await quoteRepository.isTagged({
        where: {
          quoteId: Number(quote.id),
          tagId: Number(tag.id),
        },
      });

      expect(result).toBe(true);
    });

    it('should return false if the quote is not tagged', async () => {
      const [user, quote] = await Promise.all([
        prisma.user.create({ data: userFactory() }),
        prisma.quote.create({ data: quoteFactory() }),
      ]);

      const tag = await prisma.tag.create({
        data: {
          ...tagFactory(),
          userId: Number(user.id),
        },
      });

      const result = await quoteRepository.isTagged({
        where: {
          quoteId: Number(quote.id),
          tagId: Number(tag.id),
        },
      });

      expect(result).toBe(false);
    });
  });

  describe('favorite', () => {
    it('should favorite an quote', async () => {
      const quote = await prisma.quote.create({
        data: quoteFactory(),
      });

      const user = await prisma.user.create({
        data: userFactory(),
      });

      await quoteRepository.favorite({
        data: { userId: Number(user.id), quoteId: Number(quote.id) },
      });

      const relation = await prisma.userFavoriteQuote.findFirst({
        where: {
          userId: Number(user.id),
          quoteId: Number(quote.id),
        },
      });

      expect(relation).toBeDefined();
    });
  });

  describe('tag', () => {
    it('should tag an quote', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      const quote = await prisma.quote.create({
        data: quoteFactory(),
      });

      const tag = await prisma.tag.create({
        data: {
          ...tagFactory(),
          userId: Number(user.id),
        },
      });

      await quoteRepository.tag({
        data: {
          quoteId: Number(quote.id),
          tagId: Number(tag.id),
        },
      });

      await expect(
        prisma.tagQuote.findFirstOrThrow({
          where: {
            tagId: Number(tag.id),
            quoteId: Number(quote.id),
          },
        })
      ).resolves.toBeDefined();
    });
  });

  describe('untag', () => {
    it('should untag an quote', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      const quote = await prisma.quote.create({
        data: quoteFactory(),
      });

      const tag = await prisma.tag.create({
        data: {
          ...tagFactory(),
          userId: Number(user.id),
        },
      });

      await quoteRepository.tag({
        data: {
          quoteId: Number(quote.id),
          tagId: Number(tag.id),
        },
      });

      await quoteRepository.untag({
        data: {
          quoteId: Number(quote.id),
          tagId: Number(tag.id),
        },
      });

      await expect(
        prisma.tagQuote.findFirstOrThrow({
          where: {
            tagId: Number(tag.id),
            quoteId: Number(quote.id),
          },
        })
      ).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete an existing quote', async () => {
      const createdQuote = await prisma.quote.create({
        data: quoteFactory(),
      });

      await quoteRepository.delete({
        where: { uuid: createdQuote.uuid },
      });

      await expect(prisma.quote.findUniqueOrThrow({ where: { uuid: createdQuote.uuid } })).rejects.toThrow();
    });

    it('should delete only the quote passed', async () => {
      await prisma.quote.createMany({
        data: _.range(5).map(quoteFactory),
      });
      const createdQuote = await prisma.quote.create({
        data: quoteFactory(),
      });

      await quoteRepository.delete({ where: { uuid: createdQuote.uuid } });

      await expect(prisma.quote.count()).resolves.toBe(5);
    });
  });
});
