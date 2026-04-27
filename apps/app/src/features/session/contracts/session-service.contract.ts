export interface SessionPayload {
  startedAt: string;
  endedAt: string;
  quotesViewed: number;
}

export interface SyncSessionsPayload {
  sessions: SessionPayload[];
}

export interface SyncSessionsResponse {
  created: number;
}

export abstract class SessionServiceContract {
  public abstract syncBatch(payload: SyncSessionsPayload): Promise<SyncSessionsResponse>;
}
