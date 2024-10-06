import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import type { HttpClientServiceContract } from '@/shared/contracts/http-client-service.contract';
import type { HttpConfig } from '@/types/http';

export class AxiosHttpClientService implements HttpClientServiceContract {
  private _bearerToken = '';

  constructor(private readonly httpPackage: AxiosInstance) {}

  get bearerToken(): string {
    return this._bearerToken;
  }

  set bearerToken(token: string) {
    this._bearerToken = token;
    this.httpPackage.defaults.headers.Authorization = `Bearer ${token}`;
  }

  registerResponseInterceptor<TResponse = unknown, TError = unknown>(
    onSuccess?: (response: AxiosResponse<TResponse>) => AxiosResponse,
    onError?: (error: AxiosError<TError>) => unknown
  ): void {
    this.httpPackage.interceptors.response.use(onSuccess, onError);
  }

  async get<TResult, TQuery>(url: string, params?: TQuery): Promise<TResult | never> {
    const data = await this.httpPackage.get<TResult>(url, { params });
    return data?.data;
  }

  async post<TResult = unknown, TPayload = unknown>(
    url: string,
    payload?: TPayload,
    config?: HttpConfig
  ): Promise<TResult | never> {
    const data = await this.httpPackage.post<TResult>(url, payload, config);
    return data?.data;
  }

  async patch<TResult, TPayload>(url: string, payload?: TPayload, config?: HttpConfig | undefined): Promise<TResult> {
    const data = await this.httpPackage.patch<TResult>(url, payload, config);
    return data?.data;
  }

  async delete<TResult = unknown, TPayload = unknown>(
    url: string,
    payload?: TPayload,
    config?: HttpConfig
  ): Promise<TResult | never> {
    const data = await this.httpPackage.delete<TResult>(url, { data: payload, ...config });
    return data?.data;
  }
}
