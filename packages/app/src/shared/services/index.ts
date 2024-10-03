import { api } from '@/lib/axios';
import type { HttpClientServiceContract } from '@/shared/contracts/http-client-service.contract';
import { AxiosHttpClientService } from '@/shared/services/axios-http-client.service';
import type { ApiResponse, ApiResponseError } from '@/types/api';

const httpClientService: HttpClientServiceContract = new AxiosHttpClientService(api);

httpClientService.registerResponseInterceptor<ApiResponse, ApiResponseError>(undefined, async (error) => {
  const statusCode = error.response?.status;
  const message = error.response?.data?.message;

  switch (statusCode) {
    default:
      throw error;
  }
});

export { httpClientService };
