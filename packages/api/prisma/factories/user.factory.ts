import { faker } from '@faker-js/faker';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import type { FactoryEntityDefinition } from '../contracts/factory.contract';
import { FactoryContract } from '../contracts/factory.contract';
import { createUuidV4 } from '../utils';

type Entity = Omit<User, 'id' | 'avatarId' | 'createdAt' | 'updatedAt'>;

export class UserFactory extends FactoryContract<Entity> {
  public static password = 'password';

  public definition(): FactoryEntityDefinition<Entity> {
    return {
      uuid: () => createUuidV4(),
      email: () => faker.internet.email(),
      emailVerifiedAt: () => faker.date.recent(),
      name: () => faker.person.fullName(),
      password: () => bcrypt.hashSync(UserFactory.password, 10),
      username: () => faker.internet.userName(),
    };
  }
}
