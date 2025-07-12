// src/components/ui/modals/AddEntityModal.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z, ZodObject, ZodRawShape } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PlusCircle, Loader2 } from 'lucide-react';

interface FieldConfig {
  name: string;
  label: string;
  type?: string;
}

interface AddEntityModalProps<T extends ZodRawShape> {
  entityName: string;
  schema: ZodObject<T>;
  fields: FieldConfig[];
  onSubmit: (data: z.infer<ZodObject<T>>) => void;

  // Optional control props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Whether to show the trigger button
  showTrigger?: boolean;
}

export function AddEntityModal<T extends ZodRawShape>({
  entityName,
  schema,
  fields,
  onSubmit,
  open,
  onOpenChange,
  showTrigger = true,
}: AddEntityModalProps<T>) {
  const [internalOpen, setInternalOpen] = useState(false);

  const modalOpen = open ?? internalOpen;
  const setModalOpen = onOpenChange ?? setInternalOpen;

  const defaultValues = Object.keys(schema.shape).reduce((acc, key) => {
    acc[key] = '';
    return acc;
  }, {} as Record<string, any>) as z.infer<ZodObject<T>>;

  const form = useForm<z.infer<ZodObject<T>>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (data: z.infer<ZodObject<T>>) => {
    try {
      await onSubmit(data);
      form.reset();
      setModalOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add {entityName}
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm">Add New {entityName}</DialogTitle>
          <DialogDescription className="text-xs">
            Fill in the details for the new {entityName?.toLowerCase?.() || 'entity'}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
            {fields.map(({ name, label, type }) => (
              <FormField
                key={name}
                control={form.control}
                name={name as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input type={type || 'text'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                )}
                Save {entityName}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
