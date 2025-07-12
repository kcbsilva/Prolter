// src/components/ui/modals/RemoveEntityDialog.tsx
'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export interface RemoveEntityDialogProps {
  entity: any | null;
  title: string;
  description?: string;
  onConfirm: () => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

export function RemoveEntityDialog({
  entity,
  title,
  description = 'This action cannot be undone.',
  onConfirm,
  onOpenChange,
}: RemoveEntityDialogProps) {
  return (
    <AlertDialog open={!!entity} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
