import { UserService } from '@/features/user/services/user.service';
import { httpClientService } from '@/shared/services';

export const userService = new UserService(httpClientService);
