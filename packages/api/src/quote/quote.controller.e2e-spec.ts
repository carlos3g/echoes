import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { HttpStatus } from '@nestjs/common';
import { getAccessToken } from '@test/auth';
import { authorFactory, quoteFactory, tagFactory, userFactory } from '@test/factories';
import { app, prisma, server } from '@test/server';
import * as request from 'supertest';

let userRepository: UserRepositoryContract;
let quoteRepository: QuoteRepositoryContract;
let tagRepository: TagRepositoryContract;
let authorRepository: AuthorRepositoryContract;
let user: User;
let token: string;

beforeAll(() => {
  userRepository = app.get<UserRepositoryContract>(UserRepositoryContract);
  quoteRepository = app.get<QuoteRepositoryContract>(QuoteRepositoryContract);
  tagRepository = app.get<TagRepositoryContract>(TagRepositoryContract);
  authorRepository = app.get<AuthorRepositoryContract>(AuthorRepositoryContract);
});

beforeEach(async () => {
  user = await userRepository.create(userFactory());
  token = await getAccessToken(app, { email: user.email });
});

describe('(GET) /quotes', () => {
  it('should be able to view quotes paginated', async () => {
    await quoteRepository.create(quoteFactory());
    await quoteRepository.create(quoteFactory());

    const response = await request(server).get('/quotes').send();

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
  });

  it('should not return ids', async () => {
    await quoteRepository.create(quoteFactory());
    await quoteRepository.create(quoteFactory());

    const response = await request(server).get('/quotes').send();

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
    expect(response.body).not.toMatchObject({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number) as number,
          authorId: expect.any(Number) as number,
        }),
      ]),
    });
  });

  it('should be able to filter quotes by author uuid', async () => {
    const author1 = await authorRepository.create(authorFactory());
    const author2 = await authorRepository.create(authorFactory());

    const quote1 = await quoteRepository.create({ ...quoteFactory(), authorId: author1.id });
    await quoteRepository.create({ ...quoteFactory(), authorId: author2.id });

    const response = await request(server)
      .get('/quotes')
      .query({
        filters: {
          authorUuid: author1.uuid,
        },
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');

    expect(response.body).toMatchObject({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: expect.arrayContaining([
        expect.objectContaining({
          uuid: quote1.uuid,
        }),
      ]),
    });
  });

  it.skip('should be able to filter quotes by tag uuid', async () => {});
});

describe('(GET) /quotes/:uuid', () => {
  it('should be able to view a quote', async () => {
    const quote = await quoteRepository.create(quoteFactory());

    const response = await request(server).get(`/quotes/${quote.uuid}`).send();

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject({
      uuid: quote.uuid,
    });
  });

  it('should not return ids', async () => {
    const quote = await quoteRepository.create(quoteFactory());

    const response = await request(server).get(`/quotes/${quote.uuid}`).send();

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).not.toMatchObject({
      id: expect.any(Number) as number,
      authorId: expect.any(Number) as number,
    });
  });
});

describe('(GET) /quotes/:uuid/favorite', () => {
  it('should be able to favorite a quote', async () => {
    const quote = await quoteRepository.create(quoteFactory());

    const response = await request(server)
      .post(`/quotes/${quote.uuid}/favorite`)
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toBe(HttpStatus.OK);
  });
});

describe('(GET) /quotes/:uuid/unfavorite', () => {
  it('should be able to unfavorite a quote', async () => {
    const quote = await quoteRepository.create(quoteFactory());
    await quoteRepository.favorite({ data: { quoteId: quote.id, userId: user.id } });

    const response = await request(server)
      .post(`/quotes/${quote.uuid}/unfavorite`)
      .auth(token, { type: 'bearer' })
      .send({ quoteUuid: quote.uuid });

    expect(response.status).toBe(HttpStatus.OK);
    await expect(quoteRepository.isFavorited({ where: { quoteId: quote.id, userId: user.id } })).resolves.toBeFalsy();
  });
});

describe('(GET) /quotes/:uuid/tag', () => {
  it('should be able to tag a quote', async () => {
    const quote = await quoteRepository.create(quoteFactory());
    const tag = await tagRepository.create({ ...tagFactory(), userId: user.id });

    const response = await request(server)
      .post(`/quotes/${quote.uuid}/tag`)
      .auth(token, { type: 'bearer' })
      .send({ tagUuid: tag.uuid });

    expect(response.status).toBe(HttpStatus.OK);
  });

  it("should not be able to tag quote using another user's tag", async () => {
    const quote = await quoteRepository.create(quoteFactory());
    const anotherUser = await userRepository.create(userFactory());
    const tag = await tagRepository.create({ ...tagFactory(), userId: anotherUser.id });

    const response = await request(server).post(`/quotes/${quote.uuid}/tag`).auth(token, { type: 'bearer' }).send({
      tagUuid: tag.uuid,
    });

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
    await expect(
      // eslint-disable-next-line @typescript-eslint/naming-convention
      prisma.tagQuote.findUniqueOrThrow({ where: { tagId_quoteId: { tagId: tag.id, quoteId: quote.id } } })
    ).rejects.toThrow();
  });
});

describe('(GET) /quotes/:uuid/untag', () => {
  it('should be able to untag a quote', async () => {
    const quote = await quoteRepository.create(quoteFactory());
    const tag = await tagRepository.create({ ...tagFactory(), userId: user.id });
    await quoteRepository.tag({ data: { quoteId: quote.id, tagId: tag.id } });

    const response = await request(server)
      .post(`/quotes/${quote.uuid}/untag`)
      .auth(token, { type: 'bearer' })
      .send({ tagUuid: tag.uuid });

    expect(response.status).toBe(HttpStatus.OK);
    await expect(quoteRepository.isTagged({ where: { quoteId: quote.id, tagId: tag.id } })).resolves.toBeFalsy();
  });

  it("should not be able to untag quote using another user's tag", async () => {
    const quote = await quoteRepository.create(quoteFactory());
    const anotherUser = await userRepository.create(userFactory());
    const tag = await tagRepository.create({ ...tagFactory(), userId: anotherUser.id });
    await quoteRepository.tag({ data: { quoteId: quote.id, tagId: tag.id } });

    const response = await request(server).post(`/quotes/${quote.uuid}/untag`).auth(token, { type: 'bearer' }).send({
      tagUuid: tag.uuid,
    });

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
    await expect(quoteRepository.isTagged({ where: { quoteId: quote.id, tagId: tag.id } })).resolves.toBeTruthy();
  });
});
