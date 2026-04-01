import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { getAccessToken } from '@test/auth';
import { quoteFactory, tagFactory, userFactory } from '@test/factories';
import { app, server } from '@test/server';
import * as request from 'supertest';

let userRepository: UserRepositoryContract;
let tagRepository: TagRepositoryContract;
let quoteRepository: QuoteRepositoryContract;
let user: User;
let token: string;

beforeAll(() => {
  userRepository = app.get<UserRepositoryContract>(UserRepositoryContract);
  tagRepository = app.get<TagRepositoryContract>(TagRepositoryContract);
  quoteRepository = app.get<QuoteRepositoryContract>(QuoteRepositoryContract);
});

beforeEach(async () => {
  user = await userRepository.create(userFactory());
  token = await getAccessToken(app, { email: user.email });
});

describe('(GET) /tags', () => {
  it('should respond unauthorized if not authenticated', async () => {
    const response = await request(server).get('/tags').send();

    expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('should be able to view tags paginated', async () => {
    await tagRepository.create({ ...tagFactory(), userId: user.id });
    await tagRepository.create({ ...tagFactory(), userId: user.id });

    const response = await request(server).get('/tags').auth(token, { type: 'bearer' }).send();

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
  });

  it('should not be able to view tags owned by another user', async () => {
    const anotherUser = await userRepository.create(userFactory());

    await tagRepository.create({ ...tagFactory(), userId: anotherUser.id });
    await tagRepository.create({ ...tagFactory(), userId: anotherUser.id });

    const response = await request(server).get('/tags').auth(token, { type: 'bearer' }).send();

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');

    expect(response.body).toMatchObject({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      meta: expect.objectContaining({
        total: 0,
      }),
    });
  });

  it('should not return ids', async () => {
    await tagRepository.create({ ...tagFactory(), userId: user.id });
    await tagRepository.create({ ...tagFactory(), userId: user.id });

    const response = await request(server).get('/tags').auth(token, { type: 'bearer' }).send();

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');
    expect(response.body).not.toMatchObject({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number) as number,
          userId: expect.any(Number) as number,
        }),
      ]),
    });
  });
});

describe('(POST) /tags', () => {
  it('should respond unauthorized if not authenticated', async () => {
    const response = await request(server).get('/tags').send();

    expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('should create a tag', async () => {
    const title = faker.lorem.word();

    const response = await request(server).post('/tags').auth(token, { type: 'bearer' }).send({
      title,
    });

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toMatchObject({
      title,
    });
  });
});

describe('(PATCH) /tags/:uuid', () => {
  it('should respond unauthorized if not authenticated', async () => {
    const tag = await tagRepository.create({ ...tagFactory(), userId: user.id });
    const response = await request(server).patch(`/tags/${tag.uuid}`).send({ title: 'new title' });
    expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('should update a tag title', async () => {
    const tag = await tagRepository.create({ ...tagFactory(), userId: user.id });
    const newTitle = faker.lorem.word();

    const response = await request(server)
      .patch(`/tags/${tag.uuid}`)
      .auth(token, { type: 'bearer' })
      .send({ title: newTitle });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject({ title: newTitle });
  });

  it('should not update a tag owned by another user', async () => {
    const anotherUser = await userRepository.create(userFactory());
    const tag = await tagRepository.create({ ...tagFactory(), userId: anotherUser.id });

    const response = await request(server)
      .patch(`/tags/${tag.uuid}`)
      .auth(token, { type: 'bearer' })
      .send({ title: 'new title' });

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('should validate title length', async () => {
    const tag = await tagRepository.create({ ...tagFactory(), userId: user.id });

    const response = await request(server)
      .patch(`/tags/${tag.uuid}`)
      .auth(token, { type: 'bearer' })
      .send({ title: '' });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });
});

describe('(DELETE) /tags/:uuid', () => {
  it('should respond unauthorized if not authenticated', async () => {
    const tag = await tagRepository.create({ ...tagFactory(), userId: user.id });
    const response = await request(server).delete(`/tags/${tag.uuid}`).send();
    expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('should delete a tag', async () => {
    const tag = await tagRepository.create({ ...tagFactory(), userId: user.id });

    const response = await request(server).delete(`/tags/${tag.uuid}`).auth(token, { type: 'bearer' }).send();

    expect(response.status).toBe(HttpStatus.NO_CONTENT);

    // Verify tag is deleted
    const listResponse = await request(server).get('/tags').auth(token, { type: 'bearer' }).send();
    expect(listResponse.body.meta.total).toBe(0);
  });

  it('should cascade delete tag-quote associations', async () => {
    const tag = await tagRepository.create({ ...tagFactory(), userId: user.id });
    const quote = await quoteRepository.create(quoteFactory());
    await quoteRepository.tag({ data: { quoteId: quote.id, tagId: tag.id } });

    const response = await request(server).delete(`/tags/${tag.uuid}`).auth(token, { type: 'bearer' }).send();

    expect(response.status).toBe(HttpStatus.NO_CONTENT);
  });

  it('should not delete a tag owned by another user', async () => {
    const anotherUser = await userRepository.create(userFactory());
    const tag = await tagRepository.create({ ...tagFactory(), userId: anotherUser.id });

    const response = await request(server).delete(`/tags/${tag.uuid}`).auth(token, { type: 'bearer' }).send();

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });
});
