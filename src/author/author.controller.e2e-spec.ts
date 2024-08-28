import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import { HttpStatus } from '@nestjs/common';
import { authorFactory } from '@test/factories';
import { app, server } from '@test/server';
import * as request from 'supertest';

let authorRepository: AuthorRepositoryContract;

beforeAll(() => {
  authorRepository = app.get<AuthorRepositoryContract>(AuthorRepositoryContract);
});

describe('(GET) /authors', () => {
  it('should be able to view authors paginated', async () => {
    await authorRepository.create(authorFactory());
    await authorRepository.create(authorFactory());

    const response = await request(server).get('/authors').send();

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
  });

  it('should not return ids', async () => {
    await authorRepository.create(authorFactory());
    await authorRepository.create(authorFactory());

    const response = await request(server).get('/authors').send();

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
    expect(response.body).not.toMatchObject({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number) as number,
        }),
      ]),
    });
  });

  it('should be able to filter authors by birthDate', async () => {
    const author1 = await authorRepository.create(authorFactory());
    await authorRepository.create(authorFactory());

    const response = await request(server)
      .get('/authors')
      .query({
        filters: {
          birthDate: author1.birthDate,
        },
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');

    expect(response.body).toMatchObject({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: expect.arrayContaining([
        expect.objectContaining({
          birthDate: author1.birthDate.toISOString(),
        }),
      ]),
    });
  });

  it('should be able to filter authors by deathDate', async () => {
    const author1 = await authorRepository.create(authorFactory());
    await authorRepository.create(authorFactory());

    const response = await request(server)
      .get('/authors')
      .query({
        filters: {
          deathDate: author1.deathDate,
        },
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');

    expect(response.body).toMatchObject({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: expect.arrayContaining([
        expect.objectContaining({
          deathDate: author1.deathDate!.toISOString(),
        }),
      ]),
    });
  });
});

describe('(GET) /authors/:uuid', () => {
  it('should be able to view a author', async () => {
    const author = await authorRepository.create(authorFactory());

    const response = await request(server).get(`/authors/${author.uuid}`).send();

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject({
      uuid: author.uuid,
    });
  });

  it('should not return ids', async () => {
    const author = await authorRepository.create(authorFactory());

    const response = await request(server).get(`/authors/${author.uuid}`).send();

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).not.toMatchObject({
      id: expect.any(Number) as number,
    });
  });
});

describe.skip('(GET) /authors/:uuid/favorite', () => {});

describe.skip('(GET) /authors/:uuid/tag', () => {});
