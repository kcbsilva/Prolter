// src/app/client/[id]/contracts/DesktopView.tsx
'use client';

import * as React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { SignedFormBadge } from '@/components/client/contracts/SignedFormBadge';
import { Contract } from '@/types/contracts';

export default function DesktopView({ contracts }: { contracts: Contract[] }) {
  const [openContract, setOpenContract] = React.useState<Contract | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contract ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Payment Due</TableHead>
            <TableHead>Address</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell>{contract.id}</TableCell>
              <TableCell>{contract.status}</TableCell>
              <TableCell>
                {contract.services.map((s) => (
                  <Badge key={s} className="mr-1">{s}</Badge>
                ))}
              </TableCell>
              <TableCell>{contract.paymentDueDate}</TableCell>
              <TableCell>{contract.address}</TableCell>
              <TableCell>
                <button onClick={() => setOpenContract(contract)}>
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Drawer open={!!openContract} onOpenChange={() => setOpenContract(null)}>
        <DrawerContent>
          {openContract && (
            <>
              <DrawerHeader>
                <DrawerTitle>Contract {openContract.id}</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 space-y-2">
                <p><strong>Status:</strong> {openContract.status}</p>
                <p><strong>Address:</strong> {openContract.address}</p>
                <p><strong>Services:</strong> {openContract.services.join(', ')}</p>
                <p><strong>Payment Due:</strong> {openContract.paymentDueDate}</p>
                <p><strong>Bound:</strong> {openContract.bound ? 'Yes' : 'No'}</p>
                {openContract.bound && (
                  <>
                    <p><strong>Start:</strong> {openContract.startDate}</p>
                    <p><strong>End:</strong> {openContract.endDate}</p>
                  </>
                )}
                <p><strong>Signed Form:</strong> <SignedFormBadge type={openContract.signedForm} /></p>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
