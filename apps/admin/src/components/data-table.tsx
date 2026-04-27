import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PaginationMeta } from '@/types';

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  meta?: PaginationMeta;
  isLoading?: boolean;
  page: number;
  onPageChange: (page: number) => void;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  title: string;
  description: string;
}

export function DataTable<T>({
  columns,
  data,
  meta,
  isLoading,
  page,
  onPageChange,
  searchPlaceholder = 'Buscar...',
  onSearch,
  title,
  description,
}: DataTableProps<T>) {
  const [searchInput, setSearchInput] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: meta?.lastPage ?? 1,
  });

  const lastPage = meta?.lastPage ?? 1;
  const total = meta?.total ?? 0;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    onSearch?.(searchInput);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {onSearch ? (
          <form onSubmit={handleSearch} className="flex items-center gap-2" role="search">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder={searchPlaceholder}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 sm:w-80"
                aria-label={searchPlaceholder}
              />
            </div>
            <Button type="submit" variant="secondary" size="sm">
              Buscar
            </Button>
          </form>
        ) : (
          <div />
        )}
        <p className="tabular-nums text-sm text-muted-foreground" aria-live="polite">
          {total} resultado{total !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <nav className="flex items-center justify-between" aria-label="Paginacao">
        <p className="tabular-nums text-sm text-muted-foreground">
          Pagina {page} de {lastPage}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>
            <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(lastPage, page + 1))}
            disabled={page >= lastPage}
          >
            Proximo
            <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </nav>
    </div>
  );
}
