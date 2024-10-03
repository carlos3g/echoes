import { Card, CardContent } from '@/shared/components/ui/card';
import type { Quote } from '@/types/entities';

interface QuoteCardProps {
  data: Quote;
}

export const QuoteCard = (props: QuoteCardProps) => {
  const { data } = props;

  return (
    <Card className="flex flex-col justify-between">
      <CardContent className="pt-6">
        <blockquote className="mb-4 text-lg italic">{`"${data.body}"`}</blockquote>
        {data.author && <p className="text-right font-semibold">- {data.author.name}</p>}
      </CardContent>
    </Card>
  );
};
