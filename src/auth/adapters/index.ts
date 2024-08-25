import { PasswordChangeRequest } from '@app/auth/entities/password-change-request.entity';
import type { PasswordChangeRequest as PrismaPasswordChangeRequest } from '@prisma/client';

export const prismaPasswordChangeRequestToPasswordChangeRequestAdapter = (input: PrismaPasswordChangeRequest) =>
  new PasswordChangeRequest({
    ...input,
    userId: Number(input.userId),
  });
