// src/components/settings/users/RemoveUserDialog.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteUser } from '@/services/postgres/users';
import type { UserProfile } from '@/types/users';

interface RemoveUserDialogProps {
  user?: UserProfile;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function RemoveUserDialog({ user, onSuccess, trigger }: RemoveUserDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    if (!user) return;
    try {
      setLoading(true);
      await deleteUser(user.id);
      toast({ title: 'User deleted successfully.' });
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Failed to delete user.',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="destructive" size="sm"><Trash2 className="w-4 h-4" /></Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete <strong>{user.full_name || user.email}</strong>?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}