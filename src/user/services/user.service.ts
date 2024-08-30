import { HashServiceContract } from '@app/auth/contracts/hash-service.contract';
import { createUuidV4 } from '@app/shared/utils';
import { FileRepositoryContract } from '@app/storage/contracts/file-repository.contract';
import { StorageServiceContract } from '@app/storage/contracts/storage-service.contract';
import type { FileEntity } from '@app/storage/entities/file.entity';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { CreateUserInput, UpdateUserInput } from '@app/user/dtos/user-service-dtos';
import type { User } from '@app/user/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly hashService: HashServiceContract,
    private readonly storageService: StorageServiceContract,
    private readonly fileRepository: FileRepositoryContract
  ) {}

  public async create(input: CreateUserInput): Promise<User> {
    const { avatar, ...rest } = input;

    const file = avatar ? await this.uploadAvatar({ avatar }) : undefined;

    return this.userRepository.create({
      email: rest.email,
      password: this.hashService.hash(rest.password),
      name: rest.name,
      uuid: createUuidV4(),
      avatarId: file?.id,
    });
  }

  public async update(input: UpdateUserInput): Promise<User> {
    const { userId, password, ...rest } = input;

    const hashedPassword = password ? this.hashService.hash(password) : undefined;

    return this.userRepository.update({
      where: {
        id: userId,
      },
      data: {
        ...rest,
        password: hashedPassword,
      },
    });
  }

  public async getAvatar(input: { user: User }): Promise<Buffer> {
    const { user } = input;

    if (!user.avatarId) {
      throw new BadRequestException();
    }

    const file = await this.fileRepository.findUniqueOrThrow({ where: { id: user.avatarId } });

    return this.storageService.get({
      bucket: file.bucket,
      key: file.key,
    });
  }

  private async uploadAvatar(input: { avatar: Express.Multer.File }): Promise<FileEntity> {
    const { avatar } = input;

    // TODO: move this to a config file
    const bucket = 'avatars';

    const { key } = await this.storageService.set({
      bucket,
      key: avatar.originalname,
      value: avatar.buffer,
    });

    return this.fileRepository.create({ bucket, key });
  }
}
