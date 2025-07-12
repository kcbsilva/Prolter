// src/components/settings/users/UpdateUserModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { updateUser } from '@/services/postgres/users';
import type { UserProfile } from '@/types/users';

const formSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1),
  role: z.enum(['admin', 'user']),
});

type FormData = z.infer<typeof formSchema>;

interface UpdateUserModalProps {
  userProfile: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UpdateUserModal({
  userProfile,
  open,
  onOpenChange,
  onSuccess,
}: UpdateUserModalProps) {
  const { toast } = useToast();

  const resolveRole = (): 'admin' | 'user' => {
    if (typeof userProfile?.role === 'string' && (userProfile.role === 'admin' || userProfile.role === 'user')) {
      return userProfile.role;
    }
    if (
      typeof userProfile?.role === 'object' &&
      (userProfile.role.name === 'admin' || userProfile.role.name === 'user')
    ) {
      return userProfile.role.name;
    }
    return 'user';
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: {
      email: userProfile?.email || '',
      full_name: userProfile?.full_name || '',
      role: resolveRole(),
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!userProfile) return;
    try {
      await updateUser(userProfile.id, data);
      toast({ title: 'User updated successfully.' });
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Failed to update user.',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 py-4"
        >
          <div>
            <Label>Email</Label>
            <Input type="email" {...form.register('email')} />
          </div>
          <div>
            <Label>Full Name</Label>
            <Input type="text" {...form.register('full_name')} />
          </div>
          <div>
            <Label>Role</Label>
            <select
              {...form.register('role')}
              className="w-full border rounded px-3 py-2"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
