// src/components/ui/paginated-skeleton-table.tsx
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shared/ui/table';
import { Button } from '@/components/shared/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  label: React.ReactNode;
  className?: string;
}

interface PaginatedSkeletonTableProps {
  columns: Column[];
  page: number;
  totalPages: number;
  entriesCount?: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  children: React.ReactNode;
  headerContent?: React.ReactNode;

  // Optional checkbox-related props
  checkbox?: boolean;
  selected?: string[];
  toggleSelected?: (id: string) => void;
  toggleAll?: () => void;
  isAllSelected?: boolean;
}

export function PaginatedSkeletonTable({
  columns,
  page,
  totalPages,
  entriesCount,
  onPageChange,
  onRefresh,
  children,
  headerContent,
  checkbox = false,
  selected = [],
  toggleSelected = () => {},
  toggleAll = () => {},
  isAllSelected = false,
}: PaginatedSkeletonTableProps) {
  const iconSize = 'h-3 w-3';

  return (
    <div className="flex flex-col gap-1 pt-0 px-0 pb-6">
      <div className="overflow-auto rounded-md border w-full">
        <Table className="min-w-full">
          <TableHeader className="bg-muted text-xs sticky top-0 z-10">
            <TableRow>
              {checkbox && (
                <TableHead className="w-4">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleAll}
                    className="cursor-pointer"
                  />
                </TableHead>
              )}
              {headerContent}
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn('font-semibold text-gray-800 dark:text-gray-200', col.className)}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="[&>tr:nth-child(even)]:bg-muted/40">
            {children}
          </TableBody>
        </Table>
      </div>

      <div className="pt-4 flex flex-col items-center gap-2 text-xs">
        {entriesCount !== undefined && (
          <span className="text-muted-foreground">
            Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, entriesCount)} of {entriesCount} entries
          </span>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="px-2 text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-1"
            onClick={onRefresh}
          >
            <RefreshCw className={`${iconSize} mr-2`} />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
