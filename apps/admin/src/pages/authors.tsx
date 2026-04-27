import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthors } from '@/hooks/use-authors';
import type { Author } from '@/types';

const columns: ColumnDef<Author>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: 'nationality',
    header: 'Nacionalidade',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.nationality ?? '-'}</span>
    ),
  },
  {
    accessorKey: 'birthDate',
    header: 'Nascimento',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.birthDate).toLocaleDateString('pt-BR')}
      </span>
    ),
  },
  {
    accessorKey: 'deathDate',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.deathDate ? 'secondary' : 'default'}>
        {row.original.deathDate ? 'Falecido' : 'Vivo'}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Cadastro',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString('pt-BR')}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const author = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Acoes do autor">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acoes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(author.uuid)}>
              Copiar UUID
            </DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            {author.wikipediaUrl && (
              <DropdownMenuItem onClick={() => window.open(author.wikipediaUrl!, '_blank')}>
                Ver Wikipedia
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function AuthorsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAuthors({ page, perPage: 10, search });

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
      searchPlaceholder="Buscar por nome..."
      title="Autores"
      description="Gerencie os autores da plataforma"
    />
  );
}
