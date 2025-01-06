import type { TagServiceContract } from '@/features/tag/contracts/tag-service.contract';
import { TagService } from '@/features/tag/services/tag.service';
import { httpClientService } from '@/shared/services';

const tagService: TagServiceContract = new TagService(httpClientService);

export { tagService };
