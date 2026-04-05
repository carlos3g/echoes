import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { useUsers } from '@/hooks/use-users';
import type { User } from '@/types';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Usuario',
    cell: ({ row }) => {
      const user = row.original;
      const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <span className="text-sm">{row.original.email}</span>,
  },
  {
    accessorKey: 'emailVerifiedAt',
    header: 'Status',
    cell: ({ row }) => {
      const verified = !!row.original.emailVerifiedAt;
      return (
        <Badge variant={verified ? 'default' : 'secondary'}>{verified ? 'Verificado' : 'Pendente'}</Badge>
      );
    },
  },
  {
    accessorKey: 'longestStreak',
    header: 'Maior Streak',
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.longestStreak} dias</span>,
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
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Acoes do usuario">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acoes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.uuid)}>
              Copiar UUID
            </DropdownMenuItem>
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Desativar usuario</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useUsers({ page, perPage: 10, search });

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
      searchPlaceholder="Buscar por nome, email ou username..."
      title="Usuarios"
      description="Gerencie os usuarios da plataforma"
    />
  );
}
