// src/components/client/billing/DesktopBillingView.tsx
'use client';

import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/table';
import { Billing } from '@/types/client/billing';
import { BillingStatusBadge } from './BillingStatusBadge';

interface DesktopBillingViewProps {
  billings: Billing[];
}

export function DesktopBillingView({ billings }: DesktopBillingViewProps) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Issued</TableHead>
            <TableHead>Payment Method</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {billings.map(b => (
            <TableRow key={b.id}>
              <TableCell className="font-medium">{b.id}</TableCell>
              <TableCell><BillingStatusBadge status={b.status} /></TableCell>
              <TableCell>${b.amount.toFixed(2)}</TableCell>
              <TableCell>{b.dueDate}</TableCell>
              <TableCell>{b.issuedDate}</TableCell>
              <TableCell>{b.paymentMethod}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
