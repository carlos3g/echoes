import type { EnvVariables } from '@app/shared/types';
import { Uint8ArrayToBuffer } from '@app/shared/utils';
import type { StorageServiceContract } from '@app/storage/contracts/storage-service.contract';
import type {
  StorageServiceDeleteInput,
  StorageServiceGetInput,
  StorageServiceSetInput,
  StorageServiceSetOutput,
} from '@app/storage/dtos/storage-service-dtos';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3StorageService implements StorageServiceContract {
  private awsS3Client: S3Client;

  public constructor(private readonly configService: ConfigService<EnvVariables>) {
    this.awsS3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
      region: this.configService.getOrThrow('AWS_REGION'),
      endpoint: this.configService.getOrThrow('AWS_ENDPOINT'),
      forcePathStyle: true,
    });
  }

  public async get(input: StorageServiceGetInput): Promise<Buffer> {
    const response = await this.awsS3Client.send(
      new GetObjectCommand({
        Bucket: input.bucket,
        Key: input.key,
      })
    );

    const stream = await response.Body!.transformToByteArray();

    return Uint8ArrayToBuffer(stream);
  }

  public async set(input: StorageServiceSetInput): Promise<StorageServiceSetOutput> {
    await this.awsS3Client.send(
      new PutObjectCommand({
        Bucket: input.bucket,
        Key: input.key,
        Body: input.value,
      })
    );

    return { key: input.key };
  }

  public async delete(input: StorageServiceDeleteInput): Promise<void> {
    await this.awsS3Client.send(
      new DeleteObjectCommand({
        Bucket: input.bucket,
        Key: input.key,
        VersionId: input.versionId,
      })
    );
  }
}
