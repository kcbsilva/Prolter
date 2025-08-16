// src/components/client/contracts/MobileView.tsx
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { SignedFormBadge } from '@/components/client/contracts/SignedFormBadge';
import { Contract } from '@/types/client/contracts';
import { ContractStatusBadge } from '@/components/client/contracts/ContractStatusBadge';

interface MobileViewProps {
  contracts: Contract[];
  onDownload: (id: string) => void;
}

export default function MobileView({ contracts, onDownload }: MobileViewProps) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  return (
    <div className="space-y-4">
      {contracts.map((contract) => {
        const isOpen = openId === contract.id;
        const isInactive = contract.status === 'Inactive';

        return (
          <Card
            key={contract.id}
            className={`transition-all duration-200 ${
              isInactive ? 'bg-gray-50' : ''
            } ${isOpen ? 'ring-2 ring-blue-200 shadow-lg' : 'hover:shadow-md'}`}
          >
            <CardHeader
              role="button"
              aria-expanded={isOpen}
              tabIndex={0}
              className="flex flex-row justify-between items-center cursor-pointer py-4"
              onClick={() => setOpenId(isOpen ? null : contract.id)}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <CardTitle className="text-base font-semibold truncate">{contract.id}</CardTitle>
                <ContractStatusBadge status={contract.status as 'Active' | 'Inactive'} />
              </div>

              <div className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors">
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 text-gray-500 ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </div>
            </CardHeader>

            {/* Smooth Expand */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <CardContent className="space-y-4 pt-0 pb-4 border-t">
                {/* Address */}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Address
                  </p>
                  <p className="text-sm font-medium">{contract.address}</p>
                </div>

                {/* Services */}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Services
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {contract.services.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bound</p>
                    <p className="text-sm font-medium mt-1">
                      {contract.bound ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-gray-600">No</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Payment Due
                    </p>
                    <p className="text-sm font-medium mt-1">{contract.paymentDueDate}</p>
                  </div>
                </div>

                {contract.bound && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Start Date
                      </p>
                      <p className="text-sm font-medium mt-1">{contract.startDate}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        End Date
                      </p>
                      <p className="text-sm font-medium mt-1">{contract.endDate}</p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Signing Method
                  </p>
                  <SignedFormBadge type={contract.signedForm} />
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => onDownload(contract.id)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Download Contract
                  </button>
                </div>
              </CardContent>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
