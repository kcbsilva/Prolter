// src/app/client/billing/page.tsx
'use client';

import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { BillingToolbar } from '@/components/client/billing/BillingToolbar';
import { DesktopBillingView } from '@/components/client/billing/DesktopBillingView';
import { MobileBillingView } from '@/components/client/billing/MobileBillingView';
import type { Billing } from '@/types/client/billing';

// Mock data (replace with API)
const mockBillings: Billing[] = [
  {
    id: 'INV-2025-001',
    status: 'paid',
    amount: 120.5,
    dueDate: '2025-08-10',
    services: ['Internet', 'TV'],
    issuedDate: '2025-07-10',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'INV-2025-002',
    status: 'overdue',
    amount: 89.9,
    dueDate: '2025-08-01',
    services: ['Mobile'],
    issuedDate: '2025-07-01',
    paymentMethod: 'Bank Slip',
  },
];

export default function ClientBilling() {
  const isMobile = useIsMobile();
  const [billings, setBillings] = React.useState<Billing[]>(mockBillings);
  const [filter, setFilter] = React.useState<'all' | 'paid' | 'unpaid' | 'overdue'>('all');
  const [sort, setSort] = React.useState<'dueDate' | 'amount'>('dueDate');
  const [ascending, setAscending] = React.useState(true);

  const filteredBillings = React.useMemo(() => {
    let data = [...billings];

    if (filter !== 'all') {
      data = data.filter(b => b.status === filter);
    }

    data.sort((a, b) => {
      if (sort === 'dueDate') {
        return ascending
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      if (sort === 'amount') {
        return ascending ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });

    return data;
  }, [billings, filter, sort, ascending]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing</h1>

      <BillingToolbar
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
        ascending={ascending}
        onAscendingChange={setAscending}
        count={filteredBillings.length}
      />

      {filteredBillings.length === 0 ? (
        <div className="flex justify-center py-20 text-muted-foreground">
          No invoices found for this filter.
        </div>
      ) : isMobile ? (
        <MobileBillingView billings={filteredBillings} />
      ) : (
        <DesktopBillingView billings={filteredBillings} />
      )}
    </div>
  );
}
