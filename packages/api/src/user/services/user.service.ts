import { HashServiceContract } from '@app/auth/contracts/hash-service.contract';
import { Transaction } from '@app/lib/prisma/decorators/transaction.decorator';
import { convertImageToWebp, createUuidV4 } from '@app/shared/utils';
import { FileRepositoryContract } from '@app/storage/contracts/file-repository.contract';
import { StorageServiceContract } from '@app/storage/contracts/storage-service.contract';
import type { FileEntity } from '@app/storage/entities/file.entity';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { CreateUserInput } from '@app/user/dtos/user-service-dtos';
import { UpdateUserInput } from '@app/user/dtos/user-service-dtos';
import type { User } from '@app/user/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

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
      username: rest.username,
      uuid: createUuidV4(),
      avatarId: file?.id,
    });
  }

  @Transaction()
  public async update(input: UpdateUserInput): Promise<User> {
    const { userId, password, ...rest } = input;

    const hashedPassword = password ? this.hashService.hash(password) : undefined;

    const updatedUser = await this.userRepository.update({
      where: {
        id: userId,
      },
      data: {
        email: rest.email,
        name: rest.name,
        password: hashedPassword,
      },
    });

    if (input.email) {
      await this.markEmailAsUnverified({ userId });
    }

    return updatedUser;
  }

  public async markEmailAsVerified(input: { userId: number }): Promise<User> {
    return this.userRepository.update({
      where: {
        id: input.userId,
      },
      data: {
        emailVerifiedAt: DateTime.now().toJSDate(),
      },
    });
  }

  public async markEmailAsUnverified(input: { userId: number }): Promise<User> {
    return this.userRepository.update({
      where: {
        id: input.userId,
      },
      data: {
        emailVerifiedAt: null,
      },
    });
  }

  @Transaction()
  public async updateAvatar(input: { userId: number; avatar: Express.Multer.File }): Promise<User> {
    const { userId, avatar } = input;

    const oldUser = await this.userRepository.findUniqueOrThrow({ where: { id: userId } });

    const updatedFile = await this.uploadAvatar({ avatar });

    const updatedUser = await this.userRepository.update({
      where: { id: userId },
      data: { avatarId: updatedFile.id },
    });

    await this.deleteAvatar({ user: oldUser });

    return updatedUser;
  }

  public async deleteAvatar(input: { user: User }): Promise<User | void> {
    const { user } = input;

    if (!user.avatarId) {
      return;
    }

    const file = await this.fileRepository.findUniqueOrThrow({ where: { id: user.avatarId } });
    await this.storageService.delete({ bucket: file.bucket, key: file.key });
    await this.fileRepository.delete({ where: { id: user.avatarId } });
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

    const { buffer, fileName } = await convertImageToWebp({
      buffer: avatar.buffer,
      fileName: avatar.originalname,
    });

    const timeInSeconds = DateTime.now().toSeconds();

    const { key } = await this.storageService.set({
      bucket,
      key: `${timeInSeconds}${fileName}`,
      value: buffer,
    });

    return this.fileRepository.create({ bucket, key });
  }
}
