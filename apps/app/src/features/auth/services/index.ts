import type { AuthServiceContract } from '@/features/auth/contracts/auth-service.contract';
import { AuthService } from '@/features/auth/services/auth-service.service';
import { httpClientService } from '@/shared/services';

const authService: AuthServiceContract = new AuthService(httpClientService);

export { authService };
