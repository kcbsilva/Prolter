// src/components/inventory/suppliers/UpdateSupplierModal.tsx
'use client';

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Supplier } from '@/types/inventory';
import { useLocale } from '@/contexts/LocaleContext';
import { supplierSchema, SupplierFormData } from './supplierSchema';
import { Loader2 } from 'lucide-react';

interface Props {
  supplier: Supplier | null;
  onUpdate: (data: SupplierFormData) => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateSupplierModal({ supplier, onUpdate, open, onOpenChange }: Props) {
  const { t } = useLocale();

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      businessName: '',
      businessNumber: '',
      address: '',
      email: '',
      telephone: '',
    },
  });

  useEffect(() => {
    if (supplier) {
      form.reset({
        businessName: supplier.businessName,
        businessNumber: supplier.businessNumber,
        address: supplier.address,
        email: supplier.email,
        telephone: supplier.telephone,
      });
    }
  }, [supplier, form]);

  const handleSubmit = async (data: SupplierFormData) => {
    await onUpdate(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !form.formState.isSubmitting && onOpenChange(isOpen)}>
      <DialogContent aria-describedby="update-supplier-description" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {t('inventory_suppliers.edit_title', 'Edit Supplier')}
          </DialogTitle>
          <DialogDescription id="update-supplier-description" className="text-xs">
            {t('inventory_suppliers.edit_description', 'Update supplier details.')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
            {[
              { name: 'businessName', label: 'Business Name', placeholder: 'Business Name' },
              { name: 'businessNumber', label: 'Business Number', placeholder: 'CNPJ / Reg #' },
              { name: 'address', label: 'Address', placeholder: 'Full Address' },
              { name: 'email', label: 'Email', placeholder: 'Email', type: 'email' },
              { name: 'telephone', label: 'Telephone', placeholder: 'Telephone' },
            ].map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as keyof SupplierFormData}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel>{t(`inventory_suppliers.${field.name}`, field.label)}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={field.placeholder}
                        type={field.type || 'text'}
                        {...f}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                {t('inventory_suppliers.form_cancel_button', 'Cancel')}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {form.formState.isSubmitting
                  ? t('inventory_suppliers.saving', 'Saving...')
                  : t('inventory_suppliers.update_button', 'Update Supplier')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
