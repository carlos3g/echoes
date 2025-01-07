import type {
  CreateTagOutput,
  CreateTagPayload,
  ListTagsOutput,
  ListTagsPayload,
  TagServiceContract,
} from '@/features/tag/contracts/tag-service.contract';
import type { HttpClientServiceContract } from '@/shared/contracts/http-client-service.contract';

export class TagService implements TagServiceContract {
  constructor(private readonly httpClientService: HttpClientServiceContract) {}

  public list(payload: ListTagsPayload): Promise<ListTagsOutput> {
    return this.httpClientService.get<ListTagsOutput, ListTagsPayload>('/tags', {
      ...payload,
    });
  }

  public async create(payload: CreateTagPayload): Promise<CreateTagOutput> {
    return this.httpClientService.post<CreateTagOutput, CreateTagPayload>('/tags', payload);
  }
}
