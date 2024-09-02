import { EmailConfirmationToken } from '@app/auth/entities/email-confirmation-token.entity';
import { PasswordChangeRequest } from '@app/auth/entities/password-change-request.entity';
import type {
  EmailConfirmationToken as PrismaEmailConfirmationToken,
  PasswordChangeRequest as PrismaPasswordChangeRequest,
} from '@prisma/client';

export const prismaPasswordChangeRequestToPasswordChangeRequestAdapter = (input: PrismaPasswordChangeRequest) =>
  new PasswordChangeRequest({
    ...input,
    userId: Number(input.userId),
  });

export const prismaEmailConfirmationTokenToEmailConfirmationTokenAdapter = (input: PrismaEmailConfirmationToken) =>
  new EmailConfirmationToken({
    ...input,
    userId: Number(input.userId),
  });
