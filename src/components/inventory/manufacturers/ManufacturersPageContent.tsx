// src/components/inventory/manufacturers/ManufacturersPageContent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { z } from 'zod';
import { Manufacturer } from '@/types/inventory';
import { ListManufacturers } from './ListManufacturers';
import { ContentHeader } from '@/components/ui/content-header';
import { UpdateEntityModal } from '@/components/ui/modals/UpdateEntityModal';
import { RemoveEntityDialog } from '@/components/ui/modals/RemoveEntityDialog';

export const manufacturerSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessNumber: z.string().min(1, 'Business number is required'),
  address: z.string().min(1, 'Address is required'),
  telephone: z.string().min(1, 'Telephone is required'),
  email: z.string().email('Valid email is required'),
});

export type ManufacturerFormData = z.infer<typeof manufacturerSchema>;

const manufacturerFields = [
  { name: 'businessName', label: 'Business Name', type: 'text' },
  { name: 'businessNumber', label: 'Business Number', type: 'text' },
  { name: 'address', label: 'Address', type: 'text' },
  { name: 'telephone', label: 'Telephone', type: 'tel' },
  { name: 'email', label: 'Email', type: 'email' },
];

export function ManufacturersPageContent() {
  const { toast } = useToast();
  const { t: translate } = useLocale();

  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [filtered, setFiltered] = useState<Manufacturer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<Manufacturer | null>(null);
  const [deleting, setDeleting] = useState<Manufacturer | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isMassDeleteOpen, setIsMassDeleteOpen] = useState(false);
  const perPage = 10;

  const fetchManufacturers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inventory/manufacturers');
      const data = await res.json();
      setManufacturers(data);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load manufacturers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  useEffect(() => {
    const filteredResults = manufacturers.filter((m) =>
      m.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredResults);
    setPage(1);
    setSelectedIds(new Set());
    setIsAllSelected(false);
  }, [searchTerm, manufacturers]);

  const handleAdd = async (data: ManufacturerFormData) => {
    try {
      const res = await fetch('/api/inventory/manufacturers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      await fetchManufacturers();
      toast({
        title: 'Manufacturer Added',
        description: `Manufacturer "${data.businessName}" added.`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add manufacturer',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (data: ManufacturerFormData) => {
    if (!editing) return;
    try {
      const res = await fetch(`/api/inventory/manufacturers/update/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      await fetchManufacturers();
      toast({
        title: 'Manufacturer Updated',
        description: `Manufacturer "${data.businessName}" updated.`,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update manufacturer',
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
      const res = await fetch(`/api/inventory/manufacturers/remove/${deleting.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      await fetchManufacturers();
      toast({
        title: 'Manufacturer Deleted',
        description: `Manufacturer "${deleting.businessName}" deleted.`,
        variant: 'destructive',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete manufacturer',
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
      const allIds = new Set(paginated.map((m) => m.id));
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
        fetch(`/api/inventory/manufacturers/remove/${id}`, {
          method: 'DELETE',
        })
      );
      const responses = await Promise.all(deletePromises);
      const failedDeletes = responses.filter((res) => !res.ok);
      if (failedDeletes.length > 0) {
        throw new Error(`Failed to delete ${failedDeletes.length} manufacturers`);
      }
      await fetchManufacturers();
      toast({
        title: 'Manufacturers Deleted',
        description: `${selectedIds.size} manufacturer(s) deleted successfully.`,
        variant: 'destructive',
      });
      setSelectedIds(new Set());
      setIsAllSelected(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete some manufacturers',
        variant: 'destructive',
      });
    } finally {
      setIsMassDeleteOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ContentHeader
        onSearchChange={setSearchTerm}
        schema={manufacturerSchema}
        fields={manufacturerFields}
        onAddEntitySubmit={handleAdd}
      />

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm text-blue-800">
            {selectedIds.size} manufacturer(s) selected
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

      <Card>
        <CardContent className="pt-6">
          <ListManufacturers
            manufacturers={paginated}
            loading={loading}
            onEdit={(m) => {
              setEditing(m);
              setIsEditOpen(true);
            }}
            onDelete={(m) => {
              setDeleting(m);
              setIsDeleteOpen(true);
            }}
            onRefresh={fetchManufacturers}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            selectedIds={selectedIds}
            isAllSelected={isAllSelected}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
          />
        </CardContent>
      </Card>

      <UpdateEntityModal
        entityName="Manufacturer"
        schema={manufacturerSchema}
        fields={manufacturerFields}
        defaultValues={editing ? {
          businessName: editing.businessName,
          businessNumber: editing.businessNumber,
          address: editing.address,
          telephone: editing.telephone,
          email: editing.email,
        } : {
          businessName: '',
          businessNumber: '',
          address: '',
          telephone: '',
          email: '',
        }}
        open={isEditOpen}
        onOpenChange={(open: boolean) => {
          setIsEditOpen(open);
          if (!open) setEditing(null);
        }}
        onSubmit={handleUpdate}
      />

      {isDeleteOpen && (
        <RemoveEntityDialog
          entityName={deleting?.businessName || 'Manufacturer'}
          onConfirm={handleDelete}
        />
      )}

      {isMassDeleteOpen && (
        <RemoveEntityDialog
          entityName={`${selectedIds.size} selected manufacturer(s)`}
          onConfirm={handleMassDelete}
        />
      )}
    </div>
  );
}