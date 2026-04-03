import type { SessionServiceContract } from '@/features/session/contracts/session-service.contract';
import { SessionService } from '@/features/session/services/session.service';
import { httpClientService } from '@/shared/services';

const sessionService: SessionServiceContract = new SessionService(httpClientService);

export { sessionService };
