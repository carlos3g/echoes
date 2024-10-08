import type {
  GetQuoteOutput,
  GetQuotePayload,
  ListQuotesOutput,
  ListQuotesPayload,
  QuoteServiceContract,
} from '@/features/quote/contracts/quote-service.contract';
import type { HttpClientServiceContract } from '@/shared/contracts/http-client-service.contract';

export class QuoteService implements QuoteServiceContract {
  constructor(private readonly httpClientService: HttpClientServiceContract) {}

  public get(uuid: string): Promise<GetQuoteOutput> {
    return this.httpClientService.get<GetQuoteOutput, GetQuotePayload>(`/quotes/${uuid}`, {});
  }

  public list(payload: ListQuotesPayload): Promise<ListQuotesOutput> {
    return this.httpClientService.get<ListQuotesOutput, ListQuotesPayload>('/quotes', {
      ...payload,
    });
  }
}
