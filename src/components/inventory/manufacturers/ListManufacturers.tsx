// src/components/inventory/manufacturers/ListManufacturers.tsx
'use client';

import React from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import {
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { PaginatedSkeletonTable } from '@/components/ui/paginated-skeleton-table';
import { RemoveManufacturerDialog } from './RemoveManufacturerDialog';
import type { Manufacturer } from '@/types/inventory';

interface Props {
  manufacturers: Manufacturer[];
  onEdit: (manufacturer: Manufacturer) => void;
  onDelete: (manufacturer: Manufacturer) => void;
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

export function ListManufacturers({
  manufacturers,
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
  const showCheckboxes = Boolean(onSelectAll && onSelectItem);

  const columns = [
    { key: 'id', label: 'ID', className: 'w-16 text-xs' },
    { key: 'businessName', label: 'Business Name', className: 'text-xs' },
    { key: 'businessNumber', label: 'Business Number', className: 'text-xs' },
    { key: 'address', label: 'Address', className: 'text-xs' },
    { key: 'telephone', label: 'Telephone', className: 'text-xs' },
    { key: 'email', label: 'Email', className: 'text-xs' },
    { key: 'actions', label: 'Actions', className: 'w-28 text-xs' },
  ];

  return (
    <PaginatedSkeletonTable
      columns={columns}
      page={page}
      totalPages={totalPages}
      entriesCount={manufacturers.length}
      onPageChange={onPageChange}
      onRefresh={onRefresh}
      headerContent={
        showCheckboxes ? (
          <TableCell className="w-12">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all manufacturers"
            />
          </TableCell>
        ) : null
      }
    >
      {loading ? (
        Array.from({ length: 10 }).map((_, idx) => (
          <TableRow key={idx}>
            {showCheckboxes && (
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
            )}
            {Array.from({ length: 6 }).map((__, col) => (
              <TableCell key={col}>
                <Skeleton className="h-4 w-full max-w-[150px]" />
              </TableCell>
            ))}
            <TableCell className="text-right">
              <Skeleton className="h-4 w-20 ml-auto" />
            </TableCell>
          </TableRow>
        ))
      ) : manufacturers.length > 0 ? (
        manufacturers.map((manufacturer) => (
          <TableRow key={manufacturer.id}>
            {showCheckboxes && (
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(manufacturer.id)}
                  onCheckedChange={() => onSelectItem(manufacturer.id)}
                  aria-label={`Select ${manufacturer.businessName}`}
                />
              </TableCell>
            )}
            <TableCell className="font-mono text-muted-foreground text-xs">
              {manufacturer.id.substring(0, 8)}
            </TableCell>
            <TableCell className="text-xs">{manufacturer.businessName}</TableCell>
            <TableCell className="text-xs">{manufacturer.businessNumber}</TableCell>
            <TableCell className="text-xs">{manufacturer.address}</TableCell>
            <TableCell className="text-xs">{manufacturer.telephone}</TableCell>
            <TableCell className="text-xs">{manufacturer.email}</TableCell>
            <TableCell className="text-right space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onEdit(manufacturer)}
              >
                <Edit className={iconSize} />
                <span className="sr-only">Edit</span>
              </Button>
              <RemoveManufacturerDialog
                manufacturer={manufacturer}
                onConfirm={() => onDelete(manufacturer)}
              />
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={showCheckboxes ? columns.length + 1 : columns.length}
            className="text-center text-muted-foreground py-8 text-xs"
          >
            No manufacturers found.
          </TableCell>
        </TableRow>
      )}
    </PaginatedSkeletonTable>
  );
}
