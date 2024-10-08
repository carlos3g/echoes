export interface StorageServiceSetInput {
  key: string;
  value: string | boolean | number;
}

export type StorageServiceSetOutput = void;

export interface StorageServiceGetInput {
  key: string;
}

export interface StorageServiceDeleteInput {
  key: string;
}

export interface StorageServiceContract {
  save(input: StorageServiceSetInput): StorageServiceSetOutput;

  getString(input: StorageServiceGetInput): string | undefined;

  getNumber(input: StorageServiceGetInput): number | undefined;

  getBoolean(input: StorageServiceGetInput): boolean | undefined;

  delete(input: StorageServiceDeleteInput): void;

  clear(): void;
}
