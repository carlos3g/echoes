import type { UseCaseHandler } from '@app/shared/interfaces';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { UserFollowRepositoryContract } from '@app/user/contracts/user-follow-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';

export interface FollowUserInput {
  user: User;
  targetUsername: string;
}

@Injectable()
export class FollowUserUseCase implements UseCaseHandler {
  public constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly userFollowRepository: UserFollowRepositoryContract
  ) {}

  public async handle(input: FollowUserInput): Promise<void> {
    const { user, targetUsername } = input;
    const target = await this.userRepository.findUniqueOrThrow({ where: { username: targetUsername } });

    if (target.id === user.id) {
      throw new BadRequestException('Cannot follow yourself');
    }

    const alreadyFollowing = await this.userFollowRepository.exists({
      followerId: user.id,
      followingId: target.id,
    });

    if (alreadyFollowing) {
      return;
    }

    await this.userFollowRepository.create({ followerId: user.id, followingId: target.id });
  }
}
