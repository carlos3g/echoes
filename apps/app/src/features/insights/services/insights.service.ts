import type {
  AnnualInsightsResponse,
  CompareMonthsPayload,
  CompareMonthsResponse,
  GetAnnualInsightsPayload,
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

  public getAnnual(payload: GetAnnualInsightsPayload): Promise<AnnualInsightsResponse> {
    return this.httpClientService.get<AnnualInsightsResponse, GetAnnualInsightsPayload>('/insights/annual', payload);
  }

  public compare(payload: CompareMonthsPayload): Promise<CompareMonthsResponse> {
    return this.httpClientService.get<CompareMonthsResponse, CompareMonthsPayload>('/insights/compare', payload);
  }
}
