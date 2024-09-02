import { AuthServiceContract } from '@app/auth/contracts/auth-service.contract';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { UserService } from '@app/user/services/user.service';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { getAccessToken } from '@test/auth';
import { userFactory } from '@test/factories';
import { app, server } from '@test/server';
import * as request from 'supertest';

let userRepository: UserRepositoryContract;
let userService: UserService;
let authService: AuthServiceContract;

beforeAll(() => {
  userRepository = app.get<UserRepositoryContract>(UserRepositoryContract);
  userService = app.get<UserService>(UserService);
  authService = app.get<AuthServiceContract>(AuthServiceContract);
});

describe('(POST) /auth/sign-in', () => {
  it('should authenticate the user with valid credentials', async () => {
    const payload = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await userService.create({
      email: payload.email,
      password: payload.password,
      name: faker.person.fullName(),
    });

    const response = await request(server).post('/auth/sign-in').send(payload);

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  it('should throw NotFoundException for non existing user', async () => {
    const response = await request(server).post('/auth/sign-in').send({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
  });

  it('should throw UnauthorizedException for invalid credentials', async () => {
    const user = await userService.create({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
    });

    const response = await request(server).post('/auth/sign-in').send({
      email: user.email,
      password: faker.internet.password(),
    });

    expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
  });
});

describe('(POST) /auth/sign-up', () => {
  it('should create a new user account with valid input', async () => {
    const password = faker.internet.password();

    const response = await request(server).post('/auth/sign-up').send({
      email: faker.internet.email(),
      password,
      passwordConfirmation: password,
      name: faker.person.fullName(),
    });

    expect(response.status).toEqual(HttpStatus.OK);
  });

  it('should throw an error when trying to sign up with an existing email', async () => {
    const payload = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await userService.create({
      email: payload.email,
      password: payload.password,
      name: faker.person.fullName(),
    });

    const response = await request(server).post('/auth/sign-up').send({
      email: payload.email,
      password: faker.internet.password(),
      name: faker.person.fullName(),
    });

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
  });
});

describe('(POST) /auth/refresh', () => {
  it('should refresh the authentication token with a valid refresh token', async () => {
    const payload = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await userService.create({
      email: payload.email,
      password: payload.password,
      name: faker.person.fullName(),
    });

    const signInResponse = await request(server).post('/auth/sign-in').send({
      email: payload.email,
      password: payload.password,
    });

    const { refreshToken } = signInResponse.body as { refreshToken: string };

    const refreshResponse = await request(server).post('/auth/refresh').send({ refreshToken });

    expect(refreshResponse.status).toEqual(HttpStatus.OK);
    expect(refreshResponse.body).toHaveProperty('accessToken');
  });

  it('should throw UnauthorizedException for an invalid refresh token', async () => {
    const response = await request(server).post('/auth/refresh').send({
      refreshToken: faker.string.uuid(),
    });

    expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
  });
});

describe('(POST) /auth/forgot-password', () => {
  it('should send a forgot password email if the user exists', async () => {
    const payload = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await userService.create({
      email: payload.email,
      password: payload.password,
      name: faker.person.fullName(),
    });

    const response = await request(server).post('/auth/forgot-password').send({
      email: payload.email,
    });

    expect(response.status).toEqual(HttpStatus.OK);
  });
});

describe('(POST) /auth/reset-password/:token', () => {
  it('should reset the password with a valid token', async () => {
    const password = faker.internet.password();

    const payload = {
      email: faker.internet.email(),
      password,
      passwordConfirmation: password,
    };

    const user = await userService.create({
      email: payload.email,
      password: payload.password,
      name: faker.person.fullName(),
    });

    const { token } = await authService.createPasswordChangeRequest({ userId: user.id });

    const response = await request(server).post(`/auth/reset-password/${token}`).send(payload);

    expect(response.status).toEqual(HttpStatus.OK);
  });

  it('should throw NotFoundException for an invalid or expired token', async () => {
    const token = faker.string.uuid();

    const payload = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await userService.create({
      email: payload.email,
      password: payload.password,
      name: faker.person.fullName(),
    });

    const response = await request(server).post(`/auth/reset-password/${token}`).send({
      email: payload.email,
      password: payload.password,
      passwordConfirmation: payload.password,
    });

    expect(response.status).toEqual(HttpStatus.NOT_FOUND);
  });
});

describe('(GET) /auth/me', () => {
  it('should return logged user data', async () => {
    const { id: _, avatarId: __, ...rest } = await userRepository.create(userFactory());
    const token = await getAccessToken(app, { email: rest.email });

    const response = await request(server).get('/auth/me').auth(token, { type: 'bearer' }).send();

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toMatchObject({
      ...rest,
      createdAt: rest.createdAt.toISOString(),
      updatedAt: rest.updatedAt.toISOString(),
      emailVerifiedAt: rest.emailVerifiedAt?.toISOString(),
    });
    expect(response.body).not.toHaveProperty('id');
  });
});

describe('(PATCH) /auth/me/avatar', () => {
  it('should update the avatar', async () => {
    const { id: userId, avatarId: oldAvatarId, ...rest } = await userRepository.create(userFactory());
    const token = await getAccessToken(app, { email: rest.email });

    await request(app.getHttpServer())
      .patch('/auth/me/avatar')
      .auth(token, { type: 'bearer' })
      .set('Content-Type', 'multipart/form-data')
      .attach('avatar', './test/fixtures/avatar-valid.png')
      .expect(HttpStatus.OK);

    const updatedUser = await userRepository.findUniqueOrThrow({
      where: { id: userId },
    });

    expect(oldAvatarId).toBeNull();
    expect(updatedUser.avatarId).toEqual(expect.any(Number) as number);
  });
});

describe('(PATCH) /auth/me', () => {
  it('should update personal information successfully', async () => {
    const { email } = await userService.create(userFactory());
    const token = await getAccessToken(app, { email });

    const updateData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    };

    const response = await request(app.getHttpServer())
      .patch('/auth/me')
      .auth(token, { type: 'bearer' })
      .send(updateData);

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toHaveProperty('name', updateData.name);
    expect(response.body).toHaveProperty('email', updateData.email);
  });

  it('should return error for duplicate email', async () => {
    const { email } = await userService.create(userFactory());
    const token = await getAccessToken(app, { email });

    const secondUser = await userService.create(userFactory());

    const response = await request(app.getHttpServer())
      .patch('/auth/me')
      .auth(token, { type: 'bearer' })
      .send({ email: secondUser.email });

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body).toHaveProperty('message', 'Email already in use');
  });
});

describe('(PATCH) /auth/me/change-password', () => {
  it('should change password successfully', async () => {
    const currentPassword = faker.internet.password();
    const { email } = await userService.create({ ...userFactory(), password: currentPassword });
    const token = await getAccessToken(app, { email });
    const password = faker.internet.password();

    const response = await request(app.getHttpServer())
      .patch('/auth/change-password')
      .auth(token, { type: 'bearer' })
      .send({
        currentPassword,
        password,
        passwordConfirmation: password,
      });

    expect(response.status).toEqual(HttpStatus.OK);
  });

  it('should return error for non-matching new password and confirmation', async () => {
    const currentPassword = faker.internet.password();
    const { email } = await userService.create({ ...userFactory(), password: currentPassword });
    const token = await getAccessToken(app, { email });

    const response = await request(app.getHttpServer())
      .patch('/auth/change-password')
      .auth(token, { type: 'bearer' })
      .send({
        currentPassword,
        password: faker.internet.password(),
        passwordConfirmation: faker.internet.password(),
      });

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    expect(response.body).toHaveProperty('message', ['Passwords do not match']);
  });

  it('should return error for invalid current password', async () => {
    const currentPassword = faker.internet.password();
    const { email } = await userService.create({ ...userFactory(), password: currentPassword });
    const token = await getAccessToken(app, { email });
    const password = faker.internet.password();

    const response = await request(app.getHttpServer())
      .patch('/auth/change-password')
      .auth(token, { type: 'bearer' })
      .send({
        currentPassword: faker.internet.password(),
        password,
        passwordConfirmation: password,
      });

    expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    expect(response.body).toHaveProperty('message', 'Invalid current password');
  });
});
