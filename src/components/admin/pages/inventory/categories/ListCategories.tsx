// src/components/inventory/categories/ListCategories.tsx
'use client';

import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/shared/ui/button';
import {
  TableRow,
  TableCell,
} from '@/components/shared/ui/table';
import { PaginatedSkeletonTable } from '@/components/ui/paginated-skeleton-table';
import { Checkbox } from '@/components/shared/ui/checkbox';
import type { InventoryCategory } from '@/types/inventory';

interface Props {
  categories: InventoryCategory[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onEdit: (category: InventoryCategory) => void;
  onDelete: (category: InventoryCategory) => void;
  loading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  selectedIds?: Set<string>;
  isAllSelected?: boolean;
  onSelectAll?: () => void;
  onSelectItem?: (id: string) => void;
}

export function ListCategories({
  categories,
  searchTerm,
  setSearchTerm,
  onEdit,
  onDelete,
  loading = false,
  page,
  totalPages,
  onPageChange,
  onRefresh,
  selectedIds = new Set(),
  isAllSelected = false,
  onSelectAll,
  onSelectItem,
}: Props) {
  const iconSize = 'h-3 w-3';

  const columns = [
    {
      key: 'checkbox',
      label: (
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={() => onSelectAll?.()}
          aria-label="Select all"
        />
      ),
      className: 'w-8 text-center',
    },
    { key: 'id', label: 'ID', className: 'w-16 text-xs' },
    { key: 'name', label: 'Name', className: 'text-xs' },
    { key: 'actions', label: 'Actions', className: 'w-28 text-xs' },
  ];

  if (loading) {
    return (
      <PaginatedSkeletonTable
        columns={columns}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onRefresh={onRefresh}
        entriesCount={0} children={undefined}      />
    );
  }

  return (
    <PaginatedSkeletonTable
      columns={columns}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onRefresh={onRefresh}
      entriesCount={categories.length}
    >
      {categories.length > 0 ? (
        categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="text-center">
              <Checkbox
                checked={selectedIds.has(category.id)}
                onCheckedChange={() => onSelectItem?.(category.id)}
                aria-label={`Select ${category.name}`}
              />
            </TableCell>
            <TableCell className="font-mono text-muted-foreground text-xs">
              <span title={category.id}>{category.id.substring(0, 8)}</span>
            </TableCell>
            <TableCell className="font-medium text-xs">{category.name}</TableCell>
            <TableCell className="text-right space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onEdit(category)}
              >
                <Edit className={iconSize} />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(category)}
              >
                <Trash2 className={iconSize} />
                <span className="sr-only">Delete</span>
              </Button>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={4} className="text-center text-muted-foreground py-8 text-xs">
            {searchTerm
              ? 'No categories found matching your search.'
              : 'No categories configured yet.'}
          </TableCell>
        </TableRow>
      )}
    </PaginatedSkeletonTable>
  );
}
