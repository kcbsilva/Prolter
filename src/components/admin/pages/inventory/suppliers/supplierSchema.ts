// src/components/inventory/suppliers/supplierSchema.ts
import { z } from 'zod';

export const supplierSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessNumber: z.string().min(1, 'Business number is required'),
  address: z.string().min(1, 'Address is required'),
  telephone: z.string().min(1, 'Telephone is required'),
  email: z.string().email('Valid email is required'),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;

export const supplierFields = [
  { name: 'businessName', label: 'Business Name', type: 'text' },
  { name: 'businessNumber', label: 'Business Number', type: 'text' },
  { name: 'address', label: 'Address', type: 'text' },
  { name: 'telephone', label: 'Telephone', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
];
