import type {
  CreateTagOutput,
  CreateTagPayload,
  DeleteTagOutput,
  ListTagsOutput,
  ListTagsPayload,
  TagServiceContract,
  UpdateTagOutput,
  UpdateTagPayload,
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

  public async update(uuid: string, payload: UpdateTagPayload): Promise<UpdateTagOutput> {
    return this.httpClientService.patch<UpdateTagOutput, UpdateTagPayload>(`/tags/${uuid}`, payload);
  }

  public async delete(uuid: string): Promise<DeleteTagOutput> {
    return this.httpClientService.delete<DeleteTagOutput, void>(`/tags/${uuid}`);
  }
}
