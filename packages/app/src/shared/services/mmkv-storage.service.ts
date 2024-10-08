import type { MMKV } from 'react-native-mmkv';
import type {
  StorageServiceContract,
  StorageServiceDeleteInput,
  StorageServiceGetInput,
  StorageServiceSetInput,
  StorageServiceSetOutput,
} from '@/shared/contracts/storage-service.contract';

export class MMKVStorageService implements StorageServiceContract {
  public constructor(private mmkvInstance: MMKV) {}

  public save(input: StorageServiceSetInput): StorageServiceSetOutput {
    this.mmkvInstance.set(input.key, input.value);
  }

  public getString(input: StorageServiceGetInput): string | undefined {
    return this.mmkvInstance.getString(input.key);
  }

  public getNumber(input: StorageServiceGetInput): number | undefined {
    return this.mmkvInstance.getNumber(input.key);
  }

  public getBoolean(input: StorageServiceGetInput): boolean | undefined {
    return this.mmkvInstance.getBoolean(input.key);
  }

  public delete(input: StorageServiceDeleteInput): void {
    this.mmkvInstance.delete(input.key);
  }

  public clear(): void {
    this.mmkvInstance.clearAll();
  }
}
