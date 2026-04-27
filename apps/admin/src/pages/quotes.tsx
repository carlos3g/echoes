import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuotes } from '@/hooks/use-quotes';
import type { Quote } from '@/types';

const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: 'body',
    header: 'Citacao',
    cell: ({ row }) => (
      <p className="max-w-md truncate text-sm">{row.original.body}</p>
    ),
  },
  {
    accessorKey: 'author',
    header: 'Autor',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.author?.name ?? 'Desconhecido'}</span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Criado em',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString('pt-BR')}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const quote = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Acoes da citacao">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acoes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(quote.uuid)}>
              Copiar UUID
            </DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function QuotesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuotes({ page, perPage: 10, search });

  const tableData = useMemo(() => data?.data ?? [], [data]);

  function handleSearch(query: string) {
    setSearch(query);
    setPage(1);
  }

  return (
    <DataTable
      columns={columns}
      data={tableData}
      meta={data?.meta}
      isLoading={isLoading}
      page={page}
      onPageChange={setPage}
      onSearch={handleSearch}
      searchPlaceholder="Buscar por texto ou autor..."
      title="Citacoes"
      description="Gerencie as citacoes da plataforma"
    />
  );
}
