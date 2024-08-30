import type {
  StorageServiceDeleteInput,
  StorageServiceGetInput,
  StorageServiceSetInput,
  StorageServiceSetOutput,
} from '@app/storage/dtos/storage-service-dtos';

export abstract class StorageServiceContract {
  public abstract get(input: StorageServiceGetInput): Promise<Buffer>;

  public abstract set(input: StorageServiceSetInput): Promise<StorageServiceSetOutput>;

  public abstract delete(input: StorageServiceDeleteInput): Promise<void>;
}
