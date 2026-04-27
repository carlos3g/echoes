import { ResendClient, resendClientProvider } from '@app/email/services/resend-client.provider';
import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { Resend } from 'resend';

describe('resendClientProvider', () => {
  it('should provide a Resend instance built from RESEND_API_KEY', async () => {
    const apiKey = `re_${faker.string.alphanumeric(32)}`;
    const configService = { getOrThrow: jest.fn().mockReturnValue(apiKey) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [resendClientProvider, { provide: ConfigService, useValue: configService }],
    }).compile();

    const client = module.get(ResendClient);

    expect(client).toBeInstanceOf(Resend);
    expect(configService.getOrThrow).toHaveBeenCalledWith('RESEND_API_KEY');
  });

  it('should throw at instantiation when RESEND_API_KEY is missing', async () => {
    const configService = {
      getOrThrow: jest.fn().mockImplementation(() => {
        throw new Error('Configuration key "RESEND_API_KEY" does not exist');
      }),
    };

    await expect(
      Test.createTestingModule({
        providers: [resendClientProvider, { provide: ConfigService, useValue: configService }],
      }).compile()
    ).rejects.toThrow('RESEND_API_KEY');
  });

  it('should expose ResendClient via a Symbol token (not collide with Resend class import)', () => {
    expect(typeof ResendClient).toBe('symbol');
    expect(ResendClient.toString()).toContain('ResendClient');
  });
});
