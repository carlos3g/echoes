import type {
  ActivityResponse,
  ActivityServiceContract,
  GetActivityPayload,
} from '@/features/activity/contracts/activity-service.contract';
import type { HttpClientServiceContract } from '@/shared/contracts/http-client-service.contract';

export class ActivityService implements ActivityServiceContract {
  constructor(private readonly httpClientService: HttpClientServiceContract) {}

  public list(payload: GetActivityPayload): Promise<ActivityResponse> {
    return this.httpClientService.get<ActivityResponse, { paginate: GetActivityPayload }>('/activity', {
      paginate: payload,
    });
  }
}
