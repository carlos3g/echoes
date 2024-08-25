import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import { HttpStatus } from '@nestjs/common';
import { authorFactory, quoteFactory } from '@test/factories';
import { app, server } from '@test/server';
import * as request from 'supertest';

let quoteRepository: QuoteRepositoryContract;
let authorRepository: AuthorRepositoryContract;

beforeAll(() => {
  quoteRepository = app.get<QuoteRepositoryContract>(QuoteRepositoryContract);
  authorRepository = app.get<AuthorRepositoryContract>(AuthorRepositoryContract);
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
