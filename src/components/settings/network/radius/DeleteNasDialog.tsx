// src/components/network-radius/DeleteNasDialog.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shared/ui/dialog';
import { Button } from '@/components/shared/ui/button';
import { NasType } from './NasTable';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nas?: NasType;
};

export function DeleteNasDialog({ open, onClose, onConfirm, nas }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete NAS</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete <strong>{nas?.shortname}</strong>?</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
