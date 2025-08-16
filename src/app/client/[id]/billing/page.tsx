// src/app/client/[id]/billing/page.tsx
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function InvoicesPage() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Invoices</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>INV-001</TableCell>
            <TableCell>$60.00</TableCell>
            <TableCell>2025-08-30</TableCell>
            <TableCell>Unpaid</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
