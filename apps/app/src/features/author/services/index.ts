import type { AuthorServiceContract } from '@/features/author/contracts/author-service.contract';
import { AuthorService } from '@/features/author/services/author-service.service';
import { httpClientService } from '@/shared/services';

const authorService: AuthorServiceContract = new AuthorService(httpClientService);

export { authorService };
