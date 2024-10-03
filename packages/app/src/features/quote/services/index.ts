import type { QuoteServiceContract } from '@/features/quote/contracts/quote-service.contract';
import { QuoteService } from '@/features/quote/services/quote.service';
import { httpClientService } from '@/shared/services';

const quoteService: QuoteServiceContract = new QuoteService(httpClientService);

export { quoteService };
