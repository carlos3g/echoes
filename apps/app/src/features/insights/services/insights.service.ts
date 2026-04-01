import type {
  GetInsightsPayload,
  InsightsResponse,
  InsightsServiceContract,
} from '@/features/insights/contracts/insights-service.contract';
import type { HttpClientServiceContract } from '@/shared/contracts/http-client-service.contract';

export class InsightsService implements InsightsServiceContract {
  constructor(private readonly httpClientService: HttpClientServiceContract) {}

  public get(payload: GetInsightsPayload): Promise<InsightsResponse> {
    return this.httpClientService.get<InsightsResponse, GetInsightsPayload>('/insights', payload);
  }
}
