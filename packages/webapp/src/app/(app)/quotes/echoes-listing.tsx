import { QuoteCard } from '@/app/(app)/quotes/quote-card';
import { quoteService } from '@/features/quote/services';
import { PaginationPreset } from '@/shared/components/pagination-preset';
import { Spinner } from '@/shared/components/ui/spinner';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

const makeLinkHref = (page: number) => {
  return { pathname: '/quotes', query: { page } };
};

interface EchoesListingProps {}

export const EchoesListing = (props: EchoesListingProps) => {
  const {} = props;

  const searchParams = useSearchParams();

  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;

  const { data, status } = useQuery({
    queryKey: ['quotes', page],
    queryFn: async () => quoteService.list({ paginate: { page, perPage: 10 } }),
  });

  const quotes = useMemo(() => data?.data || [], [data]);

  const isLoading = status === 'pending';

  const spinner = (
    <Spinner className="text-gray-500">
      <span className="text-gray-500">Carregando...</span>
    </Spinner>
  );

  if (isLoading) {
    return spinner;
  }

  if (!quotes.length) {
    return <p className="text-center text-gray-500">Sem resultados disponíveis :/</p>;
  }

  return (
    <div className="flex flex-col space-y-4">
      {quotes.map((item) => (
        <QuoteCard key={item.uuid} data={item} />
      ))}

      <PaginationPreset meta={data!.meta} page={page} hrefGenerator={makeLinkHref} />
    </div>
  );
};
