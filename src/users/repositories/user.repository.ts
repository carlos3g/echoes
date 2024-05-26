import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import type { UserRepositoryContract } from '@app/users/contracts';
import type {
  UserRepositoryCreateInput,
  UserRepositoryFindUniqueOrThrowInput,
  UserRepositoryUpdateInput,
} from '@app/users/dtos';
import type { User } from '@app/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserRepository implements UserRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async findUniqueOrThrow(input: UserRepositoryFindUniqueOrThrowInput) {
    return this.prismaManager.getClient().user.findUniqueOrThrow({
      where: input.where,
    });
  }

  public async create(input: UserRepositoryCreateInput): Promise<User> {
    return this.prismaManager.getClient().user.create({
      data: {
        ...input,
        uuid: uuidv4(),
      },
    });
  }

  public update(input: UserRepositoryUpdateInput): Promise<User> {
    return this.prismaManager.getClient().user.update({
      where: input.where,
      data: input.data,
    });
  }
}
