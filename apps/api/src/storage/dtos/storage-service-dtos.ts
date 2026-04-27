export interface StorageServiceGetInput {
  key: string;
  bucket: string;
}

export interface StorageServiceSetInput {
  key: string;
  bucket: string;
  value: Buffer;
}

export interface StorageServiceSetOutput {
  key: string;
}

export interface StorageServiceDeleteInput {
  bucket: string;
  key: string;
  versionId?: string;
}
