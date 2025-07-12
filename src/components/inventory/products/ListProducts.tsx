// src/components/inventory/products/ListProducts.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TableRow, TableCell } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { Product } from '@/types/inventory';
import { useLocale } from '@/contexts/LocaleContext';
import { inventoryCategories, manufacturers, suppliers } from '@/data/inventory';
import { PaginatedSkeletonTable } from '@/components/ui/paginated-skeleton-table';

interface Props {
  products: Product[];
  loading: boolean;
  page: number;
  totalPages: number;
  setEditingProduct: (product: Product) => void;
  setProductToDelete: (product: Product) => void;
  onPageChange: (page: number) => void;
  totalItems: number;
}

export function ListProducts({
  products,
  loading,
  page,
  totalPages,
  setEditingProduct,
  setProductToDelete,
  onPageChange,
}: Props) {
  const { t } = useLocale();
  const iconSize = 'h-3 w-3';

  return (
    <div className="p-6">
      <PaginatedSkeletonTable
        columns={[
          { key: 'id', label: 'ID', className: 'w-16 text-xs font-bold' },
          { key: 'patrimonialNumber', label: 'Patrimonial', className: 'text-xs font-bold' },
          { key: 'name', label: 'Name', className: 'text-xs font-bold' },
          { key: 'category', label: 'Category', className: 'text-xs font-bold' },
          { key: 'manufacturer', label: 'Manufacturer', className: 'text-xs font-bold' },
          { key: 'supplier', label: 'Supplier', className: 'text-xs font-bold' },
          { key: 'actions', label: 'Actions', className: 'text-xs font-bold text-right' },
        ]}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onRefresh={() => window.location.reload()}
      >
        {loading ? (
          [...Array(10)].map((_, i) => (
            <TableRow key={i}>
              {Array(7).fill(null).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : products.length > 0 ? (
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="text-xs text-muted-foreground font-mono">
                {product.id.substring(0, 8)}
              </TableCell>
              <TableCell className="text-xs">{product.patrimonialNumber}</TableCell>
              <TableCell className="text-xs font-medium">{product.name}</TableCell>
              <TableCell className="text-xs">
                {inventoryCategories.find((c) => c.id === product.categoryId)?.name}
              </TableCell>
              <TableCell className="text-xs">
                {manufacturers.find((m) => m.id === product.manufacturerId)?.businessName}
              </TableCell>
              <TableCell className="text-xs">
                {suppliers.find((s) => s.id === product.supplierId)?.businessName}
              </TableCell>
              <TableCell className="text-xs text-right space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setEditingProduct(product)}
                >
                  <Edit className={iconSize} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setProductToDelete(product)}
                >
                  <Trash2 className={iconSize} />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-xs text-muted-foreground py-6">
              {t('inventory_products.no_products_found', 'No products configured yet.')}
            </TableCell>
          </TableRow>
        )}
      </PaginatedSkeletonTable>
    </div>
  );
}
