import type { HttpConfig, HttpError, HttpResponse } from '@/types/http';

interface HttpClientServiceContract {
  bearerToken: string;

  registerResponseInterceptor<TResponse = unknown, TError = unknown>(
    onSuccess?: (response: HttpResponse<TResponse>) => HttpResponse,
    onError?: (error: HttpError<TError>) => unknown
  ): void;

  get<TResult, TQuery>(url: string, params?: TQuery): Promise<TResult>;
  post<TResult, TPayload>(url: string, payload?: TPayload, config?: HttpConfig): Promise<TResult>;
  patch<TResult, TPayload>(url: string, payload?: TPayload, config?: HttpConfig): Promise<TResult>;
  delete<TResult, TPayload>(url: string, payload?: TPayload, config?: HttpConfig): Promise<TResult>;
}

export type { HttpClientServiceContract };
