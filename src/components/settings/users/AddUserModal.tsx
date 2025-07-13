// src/components/settings/users/AddUserModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription, // ✅ Add this
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import { createUser } from '@/services/postgres/users';
import bcrypt from 'bcryptjs';

const formSchema = z
  .object({
    email: z.string().email(),
    full_name: z.string().min(1),
    role: z.enum(['admin', 'user']),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type AddUserFormData = z.infer<typeof formSchema>;

interface AddUserModalProps {
  onSuccess: () => void;
}

export function AddUserModal({ onSuccess }: AddUserModalProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const form = useForm<AddUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      full_name: '',
      role: 'user',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: AddUserFormData) => {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      await createUser({
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        password: hashedPassword,
      });
      toast({ title: 'User created successfully.' });
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast({ title: 'Failed to create user.', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle className="mr-2 h-4 w-4" /> Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Fill in the user’s email, name, role, and password to create an account.
          </DialogDescription>
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
            <select {...form.register('role')} className="w-full border rounded px-3 py-2">
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" {...form.register('password')} />
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input type="password" {...form.register('confirmPassword')} />
          </div>
          <Button type="submit">Create User</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
