import type {
  GetQuoteOutput,
  GetQuotePayload,
  IsQuoteTaggedOutput,
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

  public async favorite(uuid: string): Promise<void> {
    return this.httpClientService.post(`/quotes/${uuid}/favorite`);
  }

  public async unfavorite(uuid: string): Promise<void> {
    return this.httpClientService.post(`/quotes/${uuid}/unfavorite`);
  }

  public async tag(uuid: string, tagUuid: string): Promise<void> {
    return this.httpClientService.post(`/quotes/${uuid}/tag`, { tagUuid });
  }

  public async untag(uuid: string, tagUuid: string): Promise<void> {
    return this.httpClientService.post(`/quotes/${uuid}/untag`, { tagUuid });
  }

  public async isTagged(uuid: string, tagUuid: string): Promise<IsQuoteTaggedOutput> {
    return this.httpClientService.get<IsQuoteTaggedOutput, void>(`/quotes/${uuid}/tags/${tagUuid}/exists`);
  }
}
