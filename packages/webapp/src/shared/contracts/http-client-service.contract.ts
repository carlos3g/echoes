import type { HttpConfig, HttpError, HttpResponse } from '@/types/http';

interface HttpClientServiceContract {
  bearerToken: string;

  registerResponseInterceptor<TResponse = unknown, TError = unknown>(
    onSuccess?: (response: HttpResponse<TResponse>) => HttpResponse,
    onError?: (error: HttpError<TError>) => unknown
  ): void;

  get<TResult, TQuery>(url: string, params?: TQuery): Promise<TResult | never>;
  post<TResult, TPayload>(url: string, payload?: TPayload, config?: HttpConfig): Promise<TResult | never>;
  patch<TResult, TPayload>(url: string, payload?: TPayload, config?: HttpConfig): Promise<TResult | never>;
  delete<TResult, TPayload>(url: string, payload?: TPayload, config?: HttpConfig): Promise<TResult | never>;
}

export type { HttpClientServiceContract };
