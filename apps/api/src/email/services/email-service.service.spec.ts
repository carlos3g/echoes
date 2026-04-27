import { EmailService } from '@app/email/services/email-service.service';
import { ResendClient } from '@app/email/services/resend-client.provider';
import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import * as React from 'react';
import type { Resend } from 'resend';

const makeResendMock = () => ({
  emails: {
    send: jest.fn(),
  },
});

const makeConfigServiceMock = () => ({
  getOrThrow: jest.fn(),
});

describe('EmailService', () => {
  let service: EmailService;
  let resend: ReturnType<typeof makeResendMock>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: ResendClient, useFactory: makeResendMock },
        { provide: ConfigService, useFactory: makeConfigServiceMock },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    resend = module.get(ResendClient) as ReturnType<typeof makeResendMock>;
    configService = module.get(ConfigService);
  });

  it('should call Resend with from, to, subject and react element', async () => {
    const from = `Echoes <${faker.internet.email()}>`;
    const to = faker.internet.email();
    const subject = faker.lorem.sentence();
    const react = React.createElement('div', null, 'hello');

    configService.getOrThrow.mockReturnValue(from);
    resend.emails.send.mockResolvedValue({ data: { id: faker.string.uuid() }, error: null });

    await service.send({ to, subject, react });

    expect(configService.getOrThrow).toHaveBeenCalledWith('MAIL_FROM');
    expect(resend.emails.send).toHaveBeenCalledWith({ from, to, subject, react });
  });

  it('should support multiple recipients', async () => {
    const from = `Echoes <${faker.internet.email()}>`;
    const to = [faker.internet.email(), faker.internet.email()];
    const subject = faker.lorem.sentence();
    const react = React.createElement('div');

    configService.getOrThrow.mockReturnValue(from);
    resend.emails.send.mockResolvedValue({ data: { id: faker.string.uuid() }, error: null });

    await service.send({ to, subject, react });

    expect(resend.emails.send).toHaveBeenCalledWith(expect.objectContaining({ to }));
  });

  it('should throw when Resend returns an error', async () => {
    configService.getOrThrow.mockReturnValue(faker.internet.email());
    resend.emails.send.mockResolvedValue({
      data: null,
      error: { name: 'validation_error', message: 'Invalid recipient' },
    });

    await expect(
      service.send({
        to: faker.internet.email(),
        subject: faker.lorem.sentence(),
        react: React.createElement('div'),
      })
    ).rejects.toThrow('Email send failed: Invalid recipient');
  });

  it('should propagate when Resend rejects', async () => {
    configService.getOrThrow.mockReturnValue(faker.internet.email());
    resend.emails.send.mockRejectedValue(new Error('network failure'));

    await expect(
      service.send({
        to: faker.internet.email(),
        subject: faker.lorem.sentence(),
        react: React.createElement('div'),
      })
    ).rejects.toThrow('network failure');
  });

  it('should bubble up the ConfigService error when MAIL_FROM is missing', async () => {
    configService.getOrThrow.mockImplementation(() => {
      throw new Error('Configuration key "MAIL_FROM" does not exist');
    });

    await expect(
      service.send({
        to: faker.internet.email(),
        subject: faker.lorem.sentence(),
        react: React.createElement('div'),
      })
    ).rejects.toThrow('MAIL_FROM');

    expect(resend.emails.send).not.toHaveBeenCalled();
  });
});

// Type guard so the mock typings line up — the real type lives on Resend
export type _ResendType = Resend;
