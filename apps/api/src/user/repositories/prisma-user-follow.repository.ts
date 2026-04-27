import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { calcSkip, getMeta } from '@app/lib/prisma/helpers/pagination';
import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { prismaUserToUserAdapter } from '@app/user/adapters';
import type {
  UserFollowCountInput,
  UserFollowCreateInput,
  UserFollowDeleteInput,
  UserFollowExistsInput,
  UserFollowPaginatedInput,
} from '@app/user/contracts/user-follow-repository.contract';
import { UserFollowRepositoryContract } from '@app/user/contracts/user-follow-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserFollowRepository implements UserFollowRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async exists(input: UserFollowExistsInput): Promise<boolean> {
    const count = await this.prismaManager.getClient().userFollow.count({
      where: { followerId: input.followerId, followingId: input.followingId },
    });
    return count > 0;
  }

  public async create(input: UserFollowCreateInput): Promise<void> {
    await this.prismaManager.getClient().userFollow.create({
      data: { followerId: input.followerId, followingId: input.followingId },
    });
  }

  public async delete(input: UserFollowDeleteInput): Promise<void> {
    await this.prismaManager.getClient().userFollow.delete({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        followerId_followingId: {
          followerId: input.followerId,
          followingId: input.followingId,
        },
      },
    });
  }

  public async countFollowers(input: UserFollowCountInput): Promise<number> {
    return this.prismaManager.getClient().userFollow.count({
      where: { followingId: input.userId },
    });
  }

  public async countFollowing(input: UserFollowCountInput): Promise<number> {
    return this.prismaManager.getClient().userFollow.count({
      where: { followerId: input.userId },
    });
  }

  public async listFollowers(input: UserFollowPaginatedInput): Promise<PaginatedResult<User>> {
    const { userId, options } = input;
    const page = options?.page ?? 1;
    const perPage = options?.perPage ?? 20;

    const [total, follows] = await Promise.all([
      this.prismaManager.getClient().userFollow.count({ where: { followingId: userId } }),
      this.prismaManager.getClient().userFollow.findMany({
        where: { followingId: userId },
        include: { follower: true },
        orderBy: { createdAt: 'desc' },
        take: perPage,
        skip: calcSkip(page, perPage),
      }),
    ]);

    return {
      data: follows.map((f) => prismaUserToUserAdapter(f.follower)),
      meta: getMeta(total, page, perPage),
    };
  }

  public async listFollowing(input: UserFollowPaginatedInput): Promise<PaginatedResult<User>> {
    const { userId, options } = input;
    const page = options?.page ?? 1;
    const perPage = options?.perPage ?? 20;

    const [total, follows] = await Promise.all([
      this.prismaManager.getClient().userFollow.count({ where: { followerId: userId } }),
      this.prismaManager.getClient().userFollow.findMany({
        where: { followerId: userId },
        include: { following: true },
        orderBy: { createdAt: 'desc' },
        take: perPage,
        skip: calcSkip(page, perPage),
      }),
    ]);

    return {
      data: follows.map((f) => prismaUserToUserAdapter(f.following)),
      meta: getMeta(total, page, perPage),
    };
  }
}
