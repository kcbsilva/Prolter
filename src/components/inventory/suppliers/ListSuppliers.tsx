// src/components/inventory/suppliers/ListSuppliers.tsx
'use client';

import * as React from 'react';
import { PaginatedSkeletonTable } from '@/components/ui/paginated-skeleton-table';
import { TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { Supplier } from '@/types/inventory';

interface Props {
  suppliers: Supplier[];
  loading: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  selected: string[];
  toggleSelected: (id: string) => void;
  toggleAll: () => void;
  isAllSelected: boolean;
}

function SupplierRow({
  supplier,
  onEdit,
  onDelete,
}: {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}) {
  return (
    <TableRow key={supplier.id}>
      <TableCell className="text-xs">{supplier.businessName}</TableCell>
      <TableCell className="text-xs">{supplier.businessNumber}</TableCell>
      <TableCell className="text-xs text-muted-foreground">{supplier.email}</TableCell>
      <TableCell className="text-xs">{supplier.telephone}</TableCell>
      <TableCell className="text-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onEdit(supplier)}
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(supplier)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function ListSuppliers({
  suppliers,
  loading,
  onEdit,
  onDelete,
  selected,
  toggleSelected,
  toggleAll,
  isAllSelected,
}: Props) {
  return (
    <PaginatedSkeletonTable
      checkbox
      selected={selected}
      toggleSelected={toggleSelected}
      toggleAll={toggleAll}
      isAllSelected={isAllSelected}
      columns={[
        { key: 'businessName', label: 'Business Name' },
        { key: 'businessNumber', label: 'Business Number' },
        { key: 'email', label: 'Email' },
        { key: 'telephone', label: 'Telephone' },
        { key: 'actions', label: 'Actions', className: 'text-center' },
      ]}
      page={1}
      totalPages={1}
      onPageChange={() => {}}
      onRefresh={() => window.location.reload()}
    >
      {loading
        ? Array.from({ length: 10 }).map((_, idx) => (
            <TableRow key={idx}>
              {[...Array(4)].map((_, i) => (
                <TableCell key={i}><Skeleton className="h-4 w-24" /></TableCell>
              ))}
              <TableCell className="text-center"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
            </TableRow>
          ))
        : suppliers.map((supplier) => (
            <SupplierRow
              key={supplier.id}
              supplier={supplier}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
    </PaginatedSkeletonTable>
  );
}
