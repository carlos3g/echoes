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
import { useFolders } from '@/hooks/use-folders';
import type { Folder } from '@/types';

const columns: ColumnDef<Folder>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.color && (
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: row.original.color }} />
        )}
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Descricao',
    cell: ({ row }) => (
      <p className="max-w-xs truncate text-sm text-muted-foreground">
        {row.original.description ?? '-'}
      </p>
    ),
  },
  {
    accessorKey: 'visibility',
    header: 'Visibilidade',
    cell: ({ row }) => (
      <Badge variant={row.original.visibility === 'PUBLIC' ? 'default' : 'secondary'}>
        {row.original.visibility === 'PUBLIC' ? 'Publica' : 'Privada'}
      </Badge>
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
      const folder = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Acoes da pasta">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acoes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(folder.uuid)}>
              Copiar UUID
            </DropdownMenuItem>
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function FoldersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useFolders({ page, perPage: 10, search });

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
      title="Pastas"
      description="Gerencie as pastas da plataforma"
    />
  );
}
