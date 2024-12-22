import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { HttpStatus } from '@nestjs/common';
import { getAccessToken } from '@test/auth';
import { authorFactory, tagFactory, userFactory } from '@test/factories';
import { app, prisma, server } from '@test/server';
import * as request from 'supertest';

let userRepository: UserRepositoryContract;
let authorRepository: AuthorRepositoryContract;
let tagRepository: TagRepositoryContract;
let user: User;
let token: string;

beforeAll(() => {
  userRepository = app.get<UserRepositoryContract>(UserRepositoryContract);
  authorRepository = app.get<AuthorRepositoryContract>(AuthorRepositoryContract);
  tagRepository = app.get<TagRepositoryContract>(TagRepositoryContract);
});

beforeEach(async () => {
  user = await userRepository.create(userFactory());
  token = await getAccessToken(app, { email: user.email });
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

describe('(GET) /authors/:uuid/favorite', () => {
  it('should be able to favorite a author', async () => {
    const author = await authorRepository.create(authorFactory());

    const response = await request(server)
      .post(`/authors/${author.uuid}/favorite`)
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toBe(HttpStatus.OK);
  });
});

describe('(GET) /authors/:uuid/tag', () => {
  it('should be able to tag a author', async () => {
    const author = await authorRepository.create(authorFactory());
    const tag = await tagRepository.create({ ...tagFactory(), userId: user.id });

    const response = await request(server)
      .post(`/authors/${author.uuid}/tag`)
      .auth(token, { type: 'bearer' })
      .send({ tagUuid: tag.uuid });

    expect(response.status).toBe(HttpStatus.OK);
  });

  it("should not be able to tag author using another user's tag", async () => {
    const author = await authorRepository.create(authorFactory());
    const anotherUser = await userRepository.create(userFactory());
    const tag = await tagRepository.create({ ...tagFactory(), userId: anotherUser.id });

    const response = await request(server).post(`/authors/${author.uuid}/tag`).auth(token, { type: 'bearer' }).send({
      tagUuid: tag.uuid,
    });

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
    await expect(
      // eslint-disable-next-line @typescript-eslint/naming-convention
      prisma.tagAuthor.findUniqueOrThrow({ where: { tagId_authorId: { tagId: tag.id, authorId: author.id } } })
    ).rejects.toThrow();
  });
});

describe('(GET) /authors/:uuid/untag', () => {
  it('should be able to untag a author', async () => {
    const author = await authorRepository.create(authorFactory());
    const tag = await tagRepository.create({ ...tagFactory(), userId: user.id });
    await authorRepository.tag({ data: { authorId: author.id, tagId: tag.id } });

    const response = await request(server)
      .post(`/authors/${author.uuid}/untag`)
      .auth(token, { type: 'bearer' })
      .send({ tagUuid: tag.uuid });

    expect(response.status).toBe(HttpStatus.OK);
    await expect(authorRepository.isTagged({ where: { authorId: author.id, tagId: tag.id } })).resolves.toBeFalsy();
  });

  it("should not be able to untag author using another user's tag", async () => {
    const author = await authorRepository.create(authorFactory());
    const anotherUser = await userRepository.create(userFactory());
    const tag = await tagRepository.create({ ...tagFactory(), userId: anotherUser.id });
    await authorRepository.tag({ data: { authorId: author.id, tagId: tag.id } });

    const response = await request(server).post(`/authors/${author.uuid}/untag`).auth(token, { type: 'bearer' }).send({
      tagUuid: tag.uuid,
    });

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
    await expect(authorRepository.isTagged({ where: { authorId: author.id, tagId: tag.id } })).resolves.toBeTruthy();
  });
});
