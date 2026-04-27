import type {
  SyncSessionsPayload,
  SyncSessionsResponse,
  SessionServiceContract,
} from '@/features/session/contracts/session-service.contract';
import type { HttpClientServiceContract } from '@/shared/contracts/http-client-service.contract';

export class SessionService implements SessionServiceContract {
  constructor(private readonly httpClientService: HttpClientServiceContract) {}

  public syncBatch(payload: SyncSessionsPayload): Promise<SyncSessionsResponse> {
    return this.httpClientService.post<SyncSessionsResponse, SyncSessionsPayload>('/sessions/batch', payload);
  }
}
