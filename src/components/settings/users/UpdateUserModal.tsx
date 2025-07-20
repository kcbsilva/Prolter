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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { updateUser } from '@/services/postgres/users';
import type { UserProfile } from '@/types/users';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  full_name: z.string().min(1, 'Full name is required'),
  role: z.enum(['admin', 'user', 'manager']),
  status: z.enum(['active', 'inactive', 'pending']),
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const resolveRole = (): 'admin' | 'user' | 'manager' => {
    const roleName = typeof userProfile?.role === 'object' ? userProfile?.role?.name : userProfile?.role;
    return roleName === 'admin' || roleName === 'user' || roleName === 'manager' ? roleName : 'user';
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: userProfile ? {
      username: userProfile.username,
      email: userProfile.email,
      full_name: userProfile.full_name,
      role: resolveRole(),
      status: userProfile.status || 'active',
    } : {
      username: '',
      email: '',
      full_name: '',
      role: 'user',
      status: 'active',
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!userProfile) return;
    
    setIsSubmitting(true);
    try {
      await updateUser({
        id: userProfile.id,
        ...data,
      });
      toast({ 
        title: 'User updated successfully',
        description: `${data.full_name} has been updated.`,
      });
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error('Update user error:', error);
      toast({
        title: 'Failed to update user',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal closes or user changes
  React.useEffect(() => {
    if (!open || !userProfile) {
      form.reset();
    }
  }, [open, userProfile, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Edit User {userProfile?.full_name && `- ${userProfile.full_name}`}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 py-4"
        >
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username"
              type="text" 
              placeholder="Enter username"
              {...form.register('username')} 
              disabled={isSubmitting}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-destructive">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="Enter email address"
              {...form.register('email')} 
              disabled={isSubmitting}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="full_name">Full Name</Label>
            <Input 
              id="full_name"
              type="text" 
              placeholder="Enter full name"
              {...form.register('full_name')} 
              disabled={isSubmitting}
            />
            {form.formState.errors.full_name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.full_name.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Role</Label>
            <Select 
              value={form.watch('role')} 
              onValueChange={(value: 'admin' | 'user' | 'manager') => form.setValue('role', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.role && (
              <p className="text-sm text-destructive">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Status</Label>
            <Select 
              value={form.watch('status')} 
              onValueChange={(value: 'active' | 'inactive' | 'pending') => form.setValue('status', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className="text-sm text-destructive">
                {form.formState.errors.status.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !form.formState.isValid}
              className="gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}