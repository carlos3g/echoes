import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import type { UserRepositoryContract } from '@app/users/contracts';
import type { UserRepositoryCreateInput, UserRepositoryFindUniqueOrThrowInput } from '@app/users/dtos';
import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
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
}
