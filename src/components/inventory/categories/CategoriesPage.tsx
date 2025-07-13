// src/components/inventory/categories/CategoriesPageContent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { z } from 'zod';
import { InventoryCategory } from '@/types/inventory';
import { ContentHeader } from '@/components/ui/content-header';
import { UpdateEntityModal } from '@/components/ui/modals/UpdateEntityModal';
import { RemoveEntityDialog } from '@/components/ui/modals/RemoveEntityDialog';
import { ListCategories } from './ListCategories';

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

const categoryFields = [
  { name: 'name', label: 'Name', type: 'text' },
];

export function CategoriesPageContent() {
  const { toast } = useToast();
  const { t } = useLocale();

  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [filtered, setFiltered] = useState<InventoryCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<InventoryCategory | null>(null);
  const [deleting, setDeleting] = useState<InventoryCategory | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isMassDeleteOpen, setIsMassDeleteOpen] = useState(false);
  const perPage = 10;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inventory/categories');
      if (!res.ok) throw new Error('Non-200 response');
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Invalid data format');
      setCategories(data);
    } catch (error) {
      console.error('[CATEGORY_FETCH_ERROR]', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filteredResults = categories.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredResults);
    setPage(1);
    setSelectedIds(new Set());
    setIsAllSelected(false);
  }, [searchTerm, categories]);

  const handleAdd = async (data: { [x: string]: any }) => {
    try {
      const formData: CategoryFormData = categorySchema.parse(data);

      const res = await fetch('/api/inventory/categories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      await fetchCategories();
      toast({
        title: 'Category Added',
        description: `Category "${formData.name}" added.`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add category',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (data: { [x: string]: any }) => {
    if (!editing) return;

    try {
      const formData: CategoryFormData = categorySchema.parse(data);

      const res = await fetch(`/api/inventory/categories/update/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      await fetchCategories();
      toast({
        title: 'Category Updated',
        description: `Category "${formData.name}" updated.`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive',
      });
    } finally {
      setIsEditOpen(false);
      setEditing(null);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/inventory/categories/remove/${deleting.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      await fetchCategories();
      toast({
        title: 'Category Deleted',
        description: `Category "${deleting.name}" deleted.`,
        variant: 'destructive',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteOpen(false);
      setDeleting(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
      setIsAllSelected(false);
    } else {
      const allIds = new Set(paginated.map((c) => c.id));
      setSelectedIds(allIds);
      setIsAllSelected(true);
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
    setIsAllSelected(newSelected.size === paginated.length && paginated.length > 0);
  };

  const handleMassDelete = async () => {
    if (selectedIds.size === 0) return;
    try {
      const deletePromises = Array.from(selectedIds).map((id) =>
        fetch(`/api/inventory/categories/remove/${id}`, { method: 'DELETE' })
      );
      const responses = await Promise.all(deletePromises);
      const failed = responses.filter((res) => !res.ok);
      if (failed.length > 0) throw new Error();
      await fetchCategories();
      toast({
        title: 'Categories Deleted',
        description: `${selectedIds.size} category(ies) deleted.`,
        variant: 'destructive',
      });
      setSelectedIds(new Set());
      setIsAllSelected(false);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete some categories',
        variant: 'destructive',
      });
    } finally {
      setIsMassDeleteOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <ContentHeader
        onSearchChange={setSearchTerm}
        schema={categorySchema}
        fields={categoryFields}
        onAddEntitySubmit={handleAdd}
      />

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm text-blue-800">
            {selectedIds.size} category(ies) selected
          </span>
          <button
            onClick={() => setIsMassDeleteOpen(true)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete Selected
          </button>
          <button
            onClick={() => {
              setSelectedIds(new Set());
              setIsAllSelected(false);
            }}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Clear Selection
          </button>
        </div>
      )}

      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <ListCategories
            categories={paginated}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onEdit={(c) => {
              setEditing(c);
              setIsEditOpen(true);
            }}
            onDelete={(c) => {
              setDeleting(c);
              setIsDeleteOpen(true);
            }}
            onRefresh={fetchCategories}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            selectedIds={selectedIds}
            isAllSelected={isAllSelected}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            loading={loading}
          />
        </CardContent>
      </Card>

      <UpdateEntityModal
        title="Category"
        schema={categorySchema}
        fields={categoryFields}
        defaultValues={editing ? { name: editing.name } : { name: '' }}
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setEditing(null);
        }}
        onSubmit={handleUpdate}
      />

      <RemoveEntityDialog
        entity={deleting}
        title={`Delete ${deleting?.name || 'Category'}?`}
        onConfirm={handleDelete}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) setDeleting(null);
        }}
      />

      <RemoveEntityDialog
        entity={selectedIds.size > 0}
        title={`Delete ${selectedIds.size} selected category(ies)?`}
        onConfirm={handleMassDelete}
        onOpenChange={(open) => {
          setIsMassDeleteOpen(open);
        }}
      />
    </div>
  );
}
