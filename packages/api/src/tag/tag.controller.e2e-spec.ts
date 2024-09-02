import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { getAccessToken } from '@test/auth';
import { tagFactory, userFactory } from '@test/factories';
import { app, server } from '@test/server';
import * as request from 'supertest';

let userRepository: UserRepositoryContract;
let tagRepository: TagRepositoryContract;
let user: User;
let token: string;

beforeAll(() => {
  userRepository = app.get<UserRepositoryContract>(UserRepositoryContract);
  tagRepository = app.get<TagRepositoryContract>(TagRepositoryContract);
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
