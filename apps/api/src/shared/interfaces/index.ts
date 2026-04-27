interface UseCaseHandler {
  handle(input: unknown): Promise<unknown>;
}

export type { UseCaseHandler };
