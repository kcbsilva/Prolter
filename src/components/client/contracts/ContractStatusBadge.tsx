// src/components/client/contracts/ContractStatusBadge.tsx
'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';

interface ContractStatusBadgeProps {
  status: 'Active' | 'Inactive';
}

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  const isActive = status === 'Active';

  return (
    <Badge
      variant="outline"
      className={`px-2 py-1 rounded-sm text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-700 border-green-200'
          : 'bg-gray-200 text-gray-600 border-gray-300'
      }`}
    >
      {status}
    </Badge>
  );
}
