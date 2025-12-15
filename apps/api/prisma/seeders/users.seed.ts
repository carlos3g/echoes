import type { Prisma } from '@prisma/client';
import { UserFactory } from '../factories/user.factory';

const userFactory = new UserFactory();

export class UsersSeeder {
  public static async run(prisma: Prisma.TransactionClient): Promise<void> {
    await prisma.user.create({ data: userFactory.make({ email: 'test@gmail.com', username: 'test' }) });
  }
}
