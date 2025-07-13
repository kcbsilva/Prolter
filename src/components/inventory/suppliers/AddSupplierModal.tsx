// src/components/inventory/suppliers/AddSupplierModal.tsx
'use client';

import * as React from 'react';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from '@/contexts/LocaleContext';
import { supplierSchema } from './supplierSchema';
import type { SupplierFormData } from './supplierSchema';

interface Props {
  onSubmit: (data: SupplierFormData) => Promise<void>;
}

export function AddSupplierModal({ onSubmit }: Props) {
  const { t } = useLocale();
  const [open, setOpen] = React.useState(false);

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      businessName: '',
      email: '',
      telephone: '',
    },
  });

  const handleSubmit = async (data: SupplierFormData) => {
    await onSubmit(data);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !form.formState.isSubmitting && setOpen(isOpen)}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('inventory_suppliers.add_button', 'Add Supplier')}
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="add-supplier-description" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {t('inventory_suppliers.add_title', 'Add New Supplier')}
          </DialogTitle>
          <DialogDescription id="add-supplier-description" className="text-xs">
            {t('inventory_suppliers.add_description', 'Fill in the details for the new supplier.')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inventory_suppliers.business_name', 'Business Name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inventory_suppliers.email', 'Email')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., contact@acme.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inventory_suppliers.telephone', 'Telephone')}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., (123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {form.formState.isSubmitting
                  ? t('inventory_suppliers.saving', 'Saving...')
                  : t('inventory_suppliers.save_button', 'Save Supplier')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
