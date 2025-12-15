import { api } from '@/lib/axios';
import { secureStorage, storage } from '@/lib/react-native-mmkv';
import type { HttpClientServiceContract } from '@/shared/contracts/http-client-service.contract';
import type { StorageServiceContract } from '@/shared/contracts/storage-service.contract';
import { AxiosHttpClientService } from '@/shared/services/axios-http-client.service';
import { MMKVStorageService } from '@/shared/services/mmkv-storage.service';

export const storageService: StorageServiceContract = new MMKVStorageService(storage);
export const secureStorageService: StorageServiceContract = new MMKVStorageService(secureStorage);
export const httpClientService: HttpClientServiceContract = new AxiosHttpClientService(api);
