export interface SessionInput {
  userId: number;
  startedAt: Date;
  endedAt: Date;
  quotesViewed: number;
}

abstract class SessionRepositoryContract {
  public abstract batchCreate(sessions: SessionInput[]): Promise<number>;
}

export { SessionRepositoryContract };
