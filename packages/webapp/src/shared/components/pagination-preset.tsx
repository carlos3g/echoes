import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import type { ApiPaginatedResult } from '@/types/api';
import type { UrlObject } from 'url';

interface PaginationPresetProps {
  page: number;
  meta: ApiPaginatedResult<unknown>['meta'];
  hrefGenerator: (page: number) => UrlObject;
}

export const PaginationPreset: React.FC<PaginationPresetProps> = (props) => {
  const { meta, page, hrefGenerator } = props;

  const isFirstPage = page === 1;
  const isLastPage = page === meta.lastPage;

  const previousPage = page - 1;
  const nextPage = page + 1;

  return (
    <Pagination>
      <PaginationContent>
        {!isFirstPage && (
          <PaginationItem>
            <PaginationPrevious href={hrefGenerator(previousPage)} />
          </PaginationItem>
        )}

        {!isFirstPage && (
          <PaginationItem>
            <PaginationLink href={hrefGenerator(previousPage)}>{previousPage}</PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink href={hrefGenerator(page)} isActive>
            {page}
          </PaginationLink>
        </PaginationItem>

        {!isLastPage && (
          <PaginationItem>
            <PaginationLink href={hrefGenerator(nextPage)}>{nextPage}</PaginationLink>
          </PaginationItem>
        )}

        {!isLastPage && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {!isLastPage && (
          <PaginationItem>
            <PaginationLink href={hrefGenerator(meta.lastPage)} isActive={isLastPage}>
              {meta.lastPage}
            </PaginationLink>
          </PaginationItem>
        )}

        {!isLastPage && (
          <PaginationItem>
            <PaginationNext href={hrefGenerator(nextPage)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
