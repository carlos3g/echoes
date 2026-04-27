import type { InsightsServiceContract } from '@/features/insights/contracts/insights-service.contract';
import { InsightsService } from '@/features/insights/services/insights.service';
import { httpClientService } from '@/shared/services';

const insightsService: InsightsServiceContract = new InsightsService(httpClientService);

export { insightsService };
