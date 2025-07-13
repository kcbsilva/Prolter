// src/components/inventory/suppliers/SuppliersPage.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useLocale } from '@/contexts/LocaleContext';
import { ContentHeader } from '@/components/ui/content-header';
import { RemoveEntityDialog } from '@/components/ui/modals/RemoveEntityDialog';
import { UpdateSupplierModal } from './UpdateSupplierModal'; // Import the correct modal
import { supplierSchema, supplierFields } from './supplierSchema';
import { ListSuppliers } from './ListSuppliers';
import { useEntityPage } from '@/hooks/use-entity-page';
import type { Supplier } from '@/types/inventory';

export function SuppliersPageContent() {
  const { t } = useLocale();

  const {
    entities,
    editing,
    removing,
    loading,
    selected,
    toggleSelected,
    toggleAll,
    isAllSelected,
    setEditing,
    setRemoving,
    onAdd,
    onUpdate,
    onDelete,
    onBulkDelete,
  } = useEntityPage<Supplier>({
    basePath: '/api/inventory/suppliers',
    defaultSort: 'businessName',
  });

  return (
    <div className="flex flex-col gap-6">
      <ContentHeader
        title={t('inventory_suppliers.title', 'Suppliers')}
        searchPlaceholder={t('inventory_suppliers.search_placeholder', 'Search suppliers...')}
        fields={supplierFields}
        schema={supplierSchema}
        onAddEntitySubmit={onAdd}
        checkedCount={selected.length}
        onRemoveClick={onBulkDelete}
      />

      <Card>
        <CardContent className="pt-6">
          <ListSuppliers
            suppliers={entities}
            loading={loading}
            onEdit={setEditing}
            onDelete={setRemoving}
            selected={selected}
            toggleSelected={toggleSelected}
            toggleAll={toggleAll}
            isAllSelected={isAllSelected}
          />
        </CardContent>
      </Card>

      {/* Use the correct UpdateSupplierModal component */}
      <UpdateSupplierModal
        supplier={editing}
        onUpdate={onUpdate}
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      />

      <RemoveEntityDialog
        entity={removing}
        title="Delete Supplier"
        description="Are you sure you want to delete this supplier? This action cannot be undone."
        onOpenChange={(open) => !open && setRemoving(null)}
        onConfirm={onDelete}
      />
    </div>
  );
}