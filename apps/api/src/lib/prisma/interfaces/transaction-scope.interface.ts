export interface TransactionScope {
  run<T>(fn: () => Promise<T>): Promise<T>;
}
