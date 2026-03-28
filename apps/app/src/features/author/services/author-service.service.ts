import type {
  AuthorServiceContract,
  ListAuthorsOutput,
  ListAuthorsPayload,
} from '@/features/author/contracts/author-service.contract';
import type { HttpClientServiceContract } from '@/shared/contracts/http-client-service.contract';
import type { Author } from '@/types/entities';

export class AuthorService implements AuthorServiceContract {
  constructor(private readonly httpClientService: HttpClientServiceContract) {}

  public list(payload: ListAuthorsPayload): Promise<ListAuthorsOutput> {
    return this.httpClientService.get<ListAuthorsOutput, ListAuthorsPayload>('/authors', payload);
  }

  public get(uuid: string): Promise<Author> {
    return this.httpClientService.get<Author, void>(`/authors/${uuid}`);
  }
}
