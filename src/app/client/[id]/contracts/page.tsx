'use client';

import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopView from '@/components/client/contracts/DesktopView';
import MobileView from '@/components/client/contracts/MobileView';
import type { Contract } from '@/types/contracts';

// Charts
import ContractStatusChart from '@/components/client/contracts/charts/ContractStatusChart';
import ServicesDistributionChart from '@/components/client/contracts/charts/ServicesDistributionChart';
import BoundContractsChart from '@/components/client/contracts/charts/BoundContractsChart';

// Mock contracts (replace with API later)
const contracts: Contract[] = [
  {
    id: "C-2025-001",
    status: "Active",
    services: ["Internet", "TV"],
    paymentDueDate: "2025-09-01",
    address: "123 Main St, Toronto, ON",
    bound: true,
    startDate: "2025-01-01",
    endDate: "2026-01-01",
    signedForm: "office",
  },
  {
    id: "C-2025-002",
    status: "Inactive",
    services: ["Mobile", "Landline"],
    paymentDueDate: "2025-08-15",
    address: "456 Oak Ave, Toronto, ON",
    bound: false,
    startDate: "2025-02-01",
    endDate: "2026-02-01",
    signedForm: "im",
  },
];

export default function ContractsPage() {
  const isMobile = useIsMobile();

  return (
    <div className="p-6 space-y-8">
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ContractStatusChart data={contracts} />
        <ServicesDistributionChart data={contracts} />
        <BoundContractsChart data={contracts} />
      </div>

      {/* Contract List */}
      <div>
        {isMobile ? (
          <MobileView contracts={contracts} />
        ) : (
          <DesktopView contracts={contracts} />
        )}
      </div>
    </div>
  );
}
