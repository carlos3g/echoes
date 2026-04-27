import type { ActivityServiceContract } from '@/features/activity/contracts/activity-service.contract';
import { ActivityService } from '@/features/activity/services/activity.service';
import { httpClientService } from '@/shared/services';

const activityService: ActivityServiceContract = new ActivityService(httpClientService);

export { activityService };
