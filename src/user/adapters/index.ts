import { User } from '@app/user/entities/user.entity';
import type { User as PrismaUser } from '@prisma/client';

export const prismaUserToUserAdapter = (input: PrismaUser) =>
  new User({
    ...input,
    id: Number(input.id),
  });
