// src/components/client/contracts/DesktopView.tsx
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shared/ui/table';
import { ChevronDown } from 'lucide-react';
import { SignedFormBadge } from '@/components/client/contracts/SignedFormBadge';
import { Contract } from '@/types/client/contracts';
import { ContractStatusBadge } from '@/components/client/contracts/ContractStatusBadge';

interface DesktopViewProps {
  contracts: Contract[];
  onDownload: (id: string) => void;
}

export default function DesktopView({ contracts, onDownload }: DesktopViewProps) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 shrink-0"></TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Bound</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => {
            const isOpen = openId === contract.id;
            const isInactive = contract.status === 'Inactive';

            return (
              <React.Fragment key={contract.id}>
                {/* Main Row */}
                <TableRow
                  role="button"
                  aria-expanded={isOpen}
                  tabIndex={0}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    isInactive ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => setOpenId(isOpen ? null : contract.id)}
                >
                  <TableCell className="text-center">
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 text-gray-400 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-center">{contract.id}</TableCell>
                  <TableCell className="text-center">
                    <ContractStatusBadge status={contract.status as 'Active' | 'Inactive'} />
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="text-center">{contract.address}</TableCell>
                  <TableCell className="text-center">{contract.bound ? 'Yes' : 'No'}</TableCell>
                </TableRow>

                {/* Expandable Row (only rendered if open) */}
                {isOpen && (
                  <TableRow className={isInactive ? 'bg-gray-50' : 'bg-muted/30'}>
                    <TableCell colSpan={6} className="p-0 border-t">
                      <div
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                        style={{ maxHeight: isOpen ? '600px' : '0' }}
                      >
                        <div className="p-6 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Contract Period */}
                            <div>
                              <h4 className="font-medium text-sm text-gray-900 uppercase tracking-wide">
                                Contract Period
                              </h4>
                              <p className="text-sm">
                                <span className="text-gray-600">Start:</span>{' '}
                                <span className="font-medium">{contract.startDate}</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-600">End:</span>{' '}
                                <span className="font-medium">{contract.endDate}</span>
                              </p>
                            </div>

                            {/* Payment Info */}
                            <div>
                              <h4 className="font-medium text-sm text-gray-900 uppercase tracking-wide">
                                Payment Info
                              </h4>
                              <p className="text-sm">
                                <span className="text-gray-600">Due Date:</span>{' '}
                                <span className="font-medium">{contract.paymentDueDate}</span>
                              </p>
                            </div>

                            {/* Signing */}
                            <div>
                              <h4 className="font-medium text-sm text-gray-900 uppercase tracking-wide">
                                Signing Method
                              </h4>
                              <SignedFormBadge type={contract.signedForm} />
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4 border-t">
                            <button
                              onClick={() => onDownload(contract.id)}
                              className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                            >
                              Download Contract
                            </button>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
