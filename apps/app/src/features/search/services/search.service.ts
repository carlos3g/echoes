import type { SearchResult } from '@/features/search/contracts';
import type { HttpClientServiceContract } from '@/shared/contracts/http-client-service.contract';
import { httpClientService } from '@/shared/services';

interface SearchPayload {
  q: string;
  quotesLimit?: number;
  authorsLimit?: number;
  categoriesLimit?: number;
}

class SearchService {
  constructor(private readonly httpClientService: HttpClientServiceContract) {}

  public search(payload: SearchPayload): Promise<SearchResult> {
    return this.httpClientService.get<SearchResult, SearchPayload>('/search', payload);
  }
}

export const searchService = new SearchService(httpClientService);
