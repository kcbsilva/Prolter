// src/hooks/use-entity-page.ts
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseEntityPageOptions<T> {
  basePath: string;
  defaultSort?: keyof T;
}

export function useEntityPage<T extends { id: string }>({ basePath }: UseEntityPageOptions<T>) {
  const { toast } = useToast();
  const [entities, setEntities] = useState<T[]>([]);
  const [editing, setEditing] = useState<T | null>(null);
  const [removing, setRemoving] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await fetch(basePath);
      const data = await res.json();
      setEntities(data);
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const onAdd = async (data: Partial<T>) => {
    try {
      const res = await fetch(`${basePath}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      await fetchAll();
      toast({ title: 'Created successfully.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to create', variant: 'destructive' });
    }
  };

  const onUpdate = async (data: Partial<T>) => {
    if (!editing) return;
    try {
      const res = await fetch(`${basePath}/update/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      await fetchAll();
      setEditing(null);
      toast({ title: 'Updated successfully.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    }
  };

  const onDelete = async () => {
    if (!removing) return;
    try {
      const res = await fetch(`${basePath}/remove/${removing.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      await fetchAll();
      setRemoving(null);
      toast({ title: 'Deleted successfully.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const onBulkDelete = async () => {
    try {
      await Promise.all(
        selected.map((id) => fetch(`${basePath}/remove/${id}`, { method: 'DELETE' }))
      );
      await fetchAll();
      setSelected([]);
      toast({ title: 'Bulk delete completed.' });
    } catch {
      toast({ title: 'Error', description: 'Bulk delete failed', variant: 'destructive' });
    }
  };

  const toggleSelected = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === entities.length) {
      setSelected([]);
    } else {
      setSelected(entities.map((e) => e.id));
    }
  };

  const isAllSelected = selected.length > 0 && selected.length === entities.length;

  return {
    entities,
    editing,
    removing,
    loading,
    selected,
    setEditing,
    setRemoving,
    onAdd,
    onUpdate,
    onDelete,
    onBulkDelete,
    toggleSelected,
    toggleAll,
    isAllSelected,
  };
}
