import type { UseCaseHandler } from '@app/shared/interfaces';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { UserFollowRepositoryContract } from '@app/user/contracts/user-follow-repository.contract';
import { UserProfile } from '@app/user/entities/user-profile.entity';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

export interface GetUserProfileInput {
  username: string;
  currentUser?: User;
}

@Injectable()
export class GetUserProfileUseCase implements UseCaseHandler {
  public constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly userFollowRepository: UserFollowRepositoryContract
  ) {}

  public async handle(input: GetUserProfileInput): Promise<UserProfile> {
    const { username, currentUser } = input;
    const user = await this.userRepository.findUniqueOrThrow({ where: { username } });

    const [followersCount, followingCount, isFollowedByUser] = await Promise.all([
      this.userFollowRepository.countFollowers({ userId: user.id }),
      this.userFollowRepository.countFollowing({ userId: user.id }),
      currentUser
        ? this.userFollowRepository.exists({ followerId: currentUser.id, followingId: user.id })
        : Promise.resolve(false),
    ]);

    return new UserProfile({
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      username: user.username,
      bio: user.bio,
      followersCount,
      followingCount,
      isFollowedByUser: currentUser ? isFollowedByUser : undefined,
      createdAt: user.createdAt,
    });
  }
}
