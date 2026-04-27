import { EmailConfirmationEmail, EmailConfirmedEmail, ForgotPasswordEmail } from '@app/email/templates';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { UserService } from '@app/user/services/user.service';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { getAccessToken } from '@test/auth';
import { userFactory } from '@test/factories';
import { app, emailServiceMock, server } from '@test/server';
import * as request from 'supertest';

let userRepository: UserRepositoryContract;
let userService: UserService;

beforeAll(() => {
  userRepository = app.get<UserRepositoryContract>(UserRepositoryContract);
  userService = app.get<UserService>(UserService);
});

const createUnverifiedUser = async () => {
  const created = await userRepository.create(userFactory());
  return userRepository.update({
    where: { id: created.id },
    data: { emailVerifiedAt: null },
  });
};

describe('email confirmation flow', () => {
  describe('on sign-up', () => {
    it('should not send a confirmation email automatically (it is sent on demand)', async () => {
      const password = faker.internet.password();

      const response = await request(server).post('/auth/sign-up').send({
        email: faker.internet.email(),
        password,
        passwordConfirmation: password,
        name: faker.person.fullName(),
        username: faker.lorem.word(),
      });

      expect(response.status).toEqual(HttpStatus.OK);
      // Sign-up doesn't trigger the email — only /auth/email/resend does
      expect(emailServiceMock.send).not.toHaveBeenCalled();
    });
  });

  describe('(POST) /auth/email/resend', () => {
    it('should send EmailConfirmationEmail to the authenticated user with a confirm link', async () => {
      const user = await createUnverifiedUser();
      const token = await getAccessToken(app, { email: user.email });

      const response = await request(server).post('/auth/email/resend').auth(token, { type: 'bearer' }).send();

      expect(response.status).toEqual(HttpStatus.OK);
      expect(emailServiceMock.send).toHaveBeenCalledTimes(1);

      const sent = emailServiceMock.send.mock.calls[0][0] as {
        to: string;
        subject: string;
        react: { type: unknown; props: { link: string } };
      };

      expect(sent.to).toBe(user.email);
      expect(sent.subject).toBe('Confirme seu email');
      expect(sent.react.type).toBe(EmailConfirmationEmail);
      expect(sent.react.props.link).toMatch(/\/auth\/email\/confirm\/[a-f0-9-]{36}$/);
    });

    it('should require authentication', async () => {
      const response = await request(server).post('/auth/email/resend').send();

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
      expect(emailServiceMock.send).not.toHaveBeenCalled();
    });

    it('should rotate the token on consecutive resends', async () => {
      const user = await createUnverifiedUser();
      const accessToken = await getAccessToken(app, { email: user.email });

      await request(server).post('/auth/email/resend').auth(accessToken, { type: 'bearer' }).expect(HttpStatus.OK);
      await request(server).post('/auth/email/resend').auth(accessToken, { type: 'bearer' }).expect(HttpStatus.OK);

      const calls = emailServiceMock.send.mock.calls;
      const link1 = (calls[0][0] as { react: { props: { link: string } } }).react.props.link;
      const link2 = (calls[1][0] as { react: { props: { link: string } } }).react.props.link;

      expect(link1).not.toBe(link2);
    });
  });

  describe('(POST) /auth/email/confirm/:token', () => {
    const triggerResendAndExtractToken = async (email: string) => {
      const accessToken = await getAccessToken(app, { email });
      await request(server).post('/auth/email/resend').auth(accessToken, { type: 'bearer' }).expect(HttpStatus.OK);
      const calls = emailServiceMock.send.mock.calls;
      const link = (calls[calls.length - 1][0] as { react: { props: { link: string } } }).react.props.link;
      const rawToken = link.split('/').pop()!;
      emailServiceMock.send.mockClear();
      return { rawToken, accessToken };
    };

    it('should mark emailVerifiedAt when token is valid', async () => {
      const user = await createUnverifiedUser();
      const { rawToken, accessToken } = await triggerResendAndExtractToken(user.email);

      const response = await request(server)
        .post(`/auth/email/confirm/${rawToken}`)
        .auth(accessToken, { type: 'bearer' })
        .send();

      expect(response.status).toEqual(HttpStatus.OK);

      const refreshed = await userRepository.findUniqueOrThrow({ where: { id: user.id } });
      expect(refreshed.emailVerifiedAt).toBeInstanceOf(Date);
    });

    it('should send EmailConfirmedEmail after a successful confirmation', async () => {
      const user = await createUnverifiedUser();
      const { rawToken, accessToken } = await triggerResendAndExtractToken(user.email);

      await request(server)
        .post(`/auth/email/confirm/${rawToken}`)
        .auth(accessToken, { type: 'bearer' })
        .send()
        .expect(HttpStatus.OK);

      const confirmedCalls = emailServiceMock.send.mock.calls.filter(
        ([arg]) => (arg as { react: { type: unknown } }).react.type === EmailConfirmedEmail
      );
      expect(confirmedCalls.length).toBe(1);
      expect((confirmedCalls[0][0] as { to: string }).to).toBe(user.email);
      expect((confirmedCalls[0][0] as { subject: string }).subject).toBe('Bem-vindo ao Echoes');
    });

    it('should reject an invalid token', async () => {
      const user = await createUnverifiedUser();
      const accessToken = await getAccessToken(app, { email: user.email });

      const response = await request(server)
        .post(`/auth/email/confirm/${faker.string.uuid()}`)
        .auth(accessToken, { type: 'bearer' })
        .send();

      expect(response.status).toBeGreaterThanOrEqual(HttpStatus.BAD_REQUEST);
    });

    it('should require authentication', async () => {
      const response = await request(server).post(`/auth/email/confirm/${faker.string.uuid()}`).send();

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });
});

describe('forgot-password email dispatch', () => {
  it('should send ForgotPasswordEmail with a token in props', async () => {
    const password = faker.internet.password();
    const email = faker.internet.email();
    await userService.create({
      email,
      password,
      name: faker.person.fullName(),
      username: faker.internet.username().toLowerCase(),
    });

    await request(server).post('/auth/forgot-password').send({ email }).expect(HttpStatus.OK);

    expect(emailServiceMock.send).toHaveBeenCalledTimes(1);

    const sent = emailServiceMock.send.mock.calls[0][0] as {
      to: string;
      subject: string;
      react: { type: unknown; props: { token: string } };
    };

    expect(sent.to).toBe(email);
    expect(sent.subject).toBe('Código de redefinição de senha');
    expect(sent.react.type).toBe(ForgotPasswordEmail);
    expect(sent.react.props.token).toBeTruthy();
    expect(typeof sent.react.props.token).toBe('string');
  });

  it('should not call email service for a non-existent user', async () => {
    const response = await request(server)
      .post('/auth/forgot-password')
      .send({ email: faker.internet.email() });

    // Behavior may be 404 (current) or 200 silent — either way, no email should be sent
    if (response.status === HttpStatus.OK) {
      expect(emailServiceMock.send).not.toHaveBeenCalled();
    } else {
      expect(response.status).toBeGreaterThanOrEqual(HttpStatus.BAD_REQUEST);
      expect(emailServiceMock.send).not.toHaveBeenCalled();
    }
  });
});
