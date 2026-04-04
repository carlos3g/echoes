import type { UseCaseHandler } from '@app/shared/interfaces';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { UserFollowRepositoryContract } from '@app/user/contracts/user-follow-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

export interface UnfollowUserInput {
  user: User;
  targetUsername: string;
}

@Injectable()
export class UnfollowUserUseCase implements UseCaseHandler {
  public constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly userFollowRepository: UserFollowRepositoryContract
  ) {}

  public async handle(input: UnfollowUserInput): Promise<void> {
    const { user, targetUsername } = input;
    const target = await this.userRepository.findUniqueOrThrow({ where: { username: targetUsername } });

    const isFollowing = await this.userFollowRepository.exists({
      followerId: user.id,
      followingId: target.id,
    });

    if (!isFollowing) {
      return;
    }

    await this.userFollowRepository.delete({ followerId: user.id, followingId: target.id });
  }
}
