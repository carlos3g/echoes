import type {
  CategoryServiceContract,
  ListCategoriesOutput,
  ListCategoriesPayload,
} from '@/features/category/contracts/category-service.contract';
import type { HttpClientServiceContract } from '@/shared/contracts/http-client-service.contract';

export class CategoryService implements CategoryServiceContract {
  constructor(private readonly httpClientService: HttpClientServiceContract) {}

  public list(payload: ListCategoriesPayload): Promise<ListCategoriesOutput> {
    return this.httpClientService.get<ListCategoriesOutput, ListCategoriesPayload>('/categories', {
      ...payload,
    });
  }
}
