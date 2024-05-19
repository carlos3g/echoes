interface UseCaseHandler {
  handler(input: unknown): Promise<unknown>;
}

export type { UseCaseHandler };
