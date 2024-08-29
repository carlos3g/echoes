import { AuthServiceContract } from '@app/auth/contracts/auth-service.contract';
import { UserService } from '@app/user/services/user.service';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { app, server } from '@test/server';
import * as request from 'supertest';

let userService: UserService;
let authService: AuthServiceContract;

beforeAll(() => {
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
