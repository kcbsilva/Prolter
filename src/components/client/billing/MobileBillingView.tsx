// src/components/client/billing/MobileBillingView.tsx
'use client';

import * as React from 'react';
import { Billing } from '@/types/client/billing';
import { BillingStatusBadge } from './BillingStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MobileBillingViewProps {
  billings: Billing[];
}

export function MobileBillingView({ billings }: MobileBillingViewProps) {
  return (
    <div className="space-y-4">
      {billings.map(b => (
        <Card key={b.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">{b.id}</CardTitle>
            <BillingStatusBadge status={b.status} />
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div><span className="font-medium">Amount:</span> ${b.amount.toFixed(2)}</div>
            <div><span className="font-medium">Due:</span> {b.dueDate}</div>
            <div><span className="font-medium">Issued:</span> {b.issuedDate}</div>
            <div><span className="font-medium">Method:</span> {b.paymentMethod}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
