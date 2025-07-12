// src/components/ui/modals/UpdateEntityModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Path } from 'react-hook-form'; // 👈 include Path
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodObject } from 'zod';

interface FieldConfig {
  name: string;
  label: string;
  type?: string;
}

export interface UpdateEntityModalProps<T extends ZodObject<any>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity: any | null;
  title: string;
  schema: T;
  fields: FieldConfig[];
  onSubmit: (data: z.infer<T>) => Promise<void>;
}

export function UpdateEntityModal<T extends ZodObject<any>>({
  open,
  onOpenChange,
  entity,
  title,
  schema,
  fields,
  onSubmit,
}: UpdateEntityModalProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: entity || {},
    values: entity || {},
  });

  const handleSubmit = async (data: z.infer<T>) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as Path<z.infer<T>>} // ✅ correct type
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input type={field.type || 'text'} {...f} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" className="w-full">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
