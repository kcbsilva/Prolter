// src/components/client/billing/BillingToolbar.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/shared/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/shared/ui/select';
import { Toggle } from '@/components/shared/ui/toggle';

interface BillingToolbarProps {
  filter: 'all' | 'paid' | 'unpaid' | 'overdue';
  onFilterChange: (val: 'all' | 'paid' | 'unpaid' | 'overdue') => void;
  sort: 'dueDate' | 'amount';
  onSortChange: (val: 'dueDate' | 'amount') => void;
  ascending: boolean;
  onAscendingChange: (val: boolean) => void;
  count: number;
}

export function BillingToolbar({
  filter,
  onFilterChange,
  sort,
  onSortChange,
  ascending,
  onAscendingChange,
  count,
}: BillingToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex gap-2">
        <Toggle pressed={filter === 'all'} onPressedChange={() => onFilterChange('all')}>All</Toggle>
        <Toggle pressed={filter === 'paid'} onPressedChange={() => onFilterChange('paid')}>Paid</Toggle>
        <Toggle pressed={filter === 'unpaid'} onPressedChange={() => onFilterChange('unpaid')}>Unpaid</Toggle>
        <Toggle pressed={filter === 'overdue'} onPressedChange={() => onFilterChange('overdue')}>Overdue</Toggle>
      </div>

      <div className="flex items-center gap-2">
        <Select value={sort} onValueChange={(v: 'dueDate' | 'amount') => onSortChange(v)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => onAscendingChange(!ascending)}>
          {ascending ? '↑ Asc' : '↓ Desc'}
        </Button>

        <span className="text-sm text-muted-foreground">{count} invoices</span>
      </div>
    </div>
  );
}
