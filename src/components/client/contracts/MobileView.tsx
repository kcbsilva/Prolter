// src/app/client/[id]/contracts/MobileView.tsx
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';
import { SignedFormBadge } from '@/components/client/contracts/SignedFormBadge';
import { Contract } from '@/types/contracts';

export default function MobileView({ contracts }: { contracts: Contract[] }) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  return (
    <div className="space-y-3">
      {contracts.map((contract) => {
        const isOpen = openId === contract.id;
        return (
          <Card key={contract.id} className="overflow-hidden">
            <CardHeader
              className="flex flex-row justify-between items-center cursor-pointer"
              onClick={() => setOpenId(isOpen ? null : contract.id)}
            >
              <CardTitle className="text-base font-medium">{contract.id}</CardTitle>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </CardHeader>
            {isOpen && (
              <CardContent className="space-y-2 animate-in fade-in-50 slide-in-from-top-1">
                <p><strong>Status:</strong> {contract.status}</p>
                <p><strong>Address:</strong> {contract.address}</p>
                <div>
                  <p><strong>Services:</strong></p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {contract.services.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
                <p><strong>Payment Due:</strong> {contract.paymentDueDate}</p>
                <p><strong>Bound:</strong> {contract.bound ? 'Yes' : 'No'}</p>
                {contract.bound && (
                  <div className="pl-2 border-l border-muted space-y-1">
                    <p><strong>Start:</strong> {contract.startDate}</p>
                    <p><strong>End:</strong> {contract.endDate}</p>
                  </div>
                )}
                <p>
                  <strong>Signed Form:</strong>{' '}
                  <SignedFormBadge type={contract.signedForm} />
                </p>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
