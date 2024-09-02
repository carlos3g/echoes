import type {
  FileRepositoryCreateInput,
  FileRepositoryDeleteInput,
  FileRepositoryFindUniqueOrThrowInput,
} from '@app/storage/dtos/file-repository-dtos';
import type { FileEntity } from '@app/storage/entities/file.entity';

export abstract class FileRepositoryContract {
  public abstract create(input: FileRepositoryCreateInput): Promise<FileEntity>;

  public abstract findUniqueOrThrow(input: FileRepositoryFindUniqueOrThrowInput): Promise<FileEntity>;

  public abstract delete(input: FileRepositoryDeleteInput): Promise<void>;
}
