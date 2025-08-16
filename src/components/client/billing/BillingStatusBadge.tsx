// src/components/client/billing/BillingStatusBadge.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function BillingStatusBadge({ status }: { status: 'paid' | 'unpaid' | 'overdue' }) {
  const styles = {
    paid: 'bg-green-100 text-green-700 border-green-200',
    unpaid: 'bg-gray-100 text-gray-700 border-gray-200',
    overdue: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        styles[status]
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
