import type { Author } from '@app/author/entities/author.entity';
import type { Category } from '@app/category/entities/category.entity';
import type { Quote } from '@app/quote/entities/quote.entity';
import { createUuidV4 } from '@app/shared/utils';
import type { Source } from '@app/source/entities/source.entity';
import type { FileEntity } from '@app/storage/entities/file.entity';
import type { Tag } from '@app/tag/entities/tag.entity';
import type { User } from '@app/user/entities/user.entity';
import { faker } from '@faker-js/faker';

export const quoteFactory = (): Omit<Quote, 'id' | 'createdAt' | 'updatedAt' | 'authorId'> => ({
  body: faker.lorem.lines(5),
  uuid: createUuidV4(),
});

export const authorFactory = (): Omit<Author, 'id' | 'createdAt' | 'updatedAt'> => ({
  uuid: createUuidV4(),
  bio: faker.lorem.lines(5),
  birthDate: faker.date.birthdate(),
  deathDate: faker.date.recent(),
  name: faker.person.fullName(),
});

export const categoryFactory = (): Omit<Category, 'id' | 'createdAt' | 'updatedAt'> => ({
  uuid: createUuidV4(),
  title: faker.lorem.sentences(2),
});

export const sourceFactory = (): Omit<Source, 'id' | 'createdAt' | 'updatedAt' | 'quoteId'> => ({
  uuid: createUuidV4(),
  title: faker.lorem.sentences(2),
});

export const tagFactory = (): Omit<Tag, 'id' | 'createdAt' | 'updatedAt' | 'userId'> => ({
  uuid: createUuidV4(),
  title: faker.lorem.sentences(2),
});

export const userFactory = (): Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'quoteId' | 'avatarId'> => ({
  uuid: createUuidV4(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  emailVerifiedAt: faker.date.recent(),
  username: faker.internet.userName().toLowerCase(),
});

export const fileFactory = (): Omit<FileEntity, 'id'> => ({
  bucket: faker.lorem.word(),
  key: faker.system.commonFileName(),
});
