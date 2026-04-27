import type { CategoryServiceContract } from '@/features/category/contracts/category-service.contract';
import { CategoryService } from '@/features/category/services/category-service.service';
import { httpClientService } from '@/shared/services';

const categoryService: CategoryServiceContract = new CategoryService(httpClientService);

export { categoryService };
