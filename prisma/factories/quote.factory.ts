import { faker } from '@faker-js/faker';
import type { Quote } from '@prisma/client';
import type { FactoryEntityDefinition } from '../contracts/factory.contract';
import { FactoryContract } from '../contracts/factory.contract';
import { createUuidV4 } from '../utils';

type Entity = Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>;

export class QuoteFactory extends FactoryContract<Entity> {
  public definition(): FactoryEntityDefinition<Entity> {
    return {
      uuid: () => createUuidV4(),
      authorId: () => faker.number.bigInt(),
      body: () => faker.lorem.paragraphs(3),
    };
  }
}
