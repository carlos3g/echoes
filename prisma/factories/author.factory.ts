import { faker } from '@faker-js/faker';
import type { Author } from '@prisma/client';
import type { FactoryEntityDefinition } from '../contracts/factory.contract';
import { FactoryContract } from '../contracts/factory.contract';
import { createUuidV4 } from '../utils';

type Entity = Omit<Author, 'id' | 'createdAt' | 'updatedAt'>;

export class AuthorFactory extends FactoryContract<Entity> {
  public definition(): FactoryEntityDefinition<Entity> {
    return {
      uuid: () => createUuidV4(),
      name: () => faker.person.fullName(),
      bio: () => faker.lorem.paragraphs(2),
      birthDate: () => faker.date.birthdate(),
      deathDate: () => faker.date.recent(),
    };
  }
}
