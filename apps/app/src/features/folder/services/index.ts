import type { FolderServiceContract } from '@/features/folder/contracts/folder-service.contract';
import { FolderService } from '@/features/folder/services/folder.service';
import { httpClientService } from '@/shared/services';

const folderService: FolderServiceContract = new FolderService(httpClientService);

export { folderService };
