import type { AxiosError as HttpError, AxiosResponse as HttpResponse } from 'axios';

interface HttpConfig {
  headers: Record<string, string>;
}

export type { HttpConfig, HttpError, HttpResponse };
