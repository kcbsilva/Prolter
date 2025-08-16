// src/app/client/[id]/contracts/page.tsx
'use client';

import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopView from '@/components/client/contracts/DesktopView';
import MobileView from '@/components/client/contracts/MobileView';
import { ContractsToolbar } from '@/components/client/contracts/ContractsToolbar';
import type { Contract } from '@/types/client/contracts';

// Mock contracts (replace with API fetch later)
const contracts: Contract[] = [
  {
    id: 'C-2025-001',
    status: 'Active',
    services: ['Internet', 'TV'],
    paymentDueDate: '2025-09-01',
    address: '123 Main St, Toronto, ON',
    bound: true,
    startDate: '2025-01-01',
    endDate: '2026-01-01',
    signedForm: 'office',
  },
  {
    id: 'C-2025-002',
    status: 'Inactive',
    services: ['Mobile', 'Landline'],
    paymentDueDate: '2025-08-15',
    address: '456 Oak Ave, Toronto, ON',
    bound: false,
    startDate: '2025-02-01',
    endDate: '2026-02-01',
    signedForm: 'im',
  },
];

export default function ClientContracts() {
  const isMobile = useIsMobile();
  const [filters, setFilters] = React.useState({ active: true, inactive: true });
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'paymentDue' | 'startDate' | 'id'>('paymentDue');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Counts
  const counts = React.useMemo(
    () => ({
      active: contracts.filter((c) => c.status === 'Active').length,
      inactive: contracts.filter((c) => c.status === 'Inactive').length,
    }),
    []
  );

  // Filtering, searching, sorting
  const filteredContracts = React.useMemo(() => {
    let filtered = contracts.filter(
      (c) =>
        (filters.active && c.status === 'Active') ||
        (filters.inactive && c.status === 'Inactive')
    );

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.id.toLowerCase().includes(query) ||
          c.address.toLowerCase().includes(query) ||
          c.services.some((s) => s.toLowerCase().includes(query))
      );
    }

    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortBy) {
        case 'paymentDue':
          aValue = new Date(a.paymentDueDate || '1970-01-01');
          bValue = new Date(b.paymentDueDate || '1970-01-01');
          break;
        case 'startDate':
          aValue = new Date(a.startDate || '1970-01-01');
          bValue = new Date(b.startDate || '1970-01-01');
          break;
        case 'id':
          return sortOrder === 'asc'
            ? a.id.localeCompare(b.id)
            : b.id.localeCompare(a.id);
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [filters, searchQuery, sortBy, sortOrder]);

  // Download handler
  const handleDownload = React.useCallback((id: string) => {
    // Replace with API download logic
    alert(`Downloading contract: ${id}`);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded-lg mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
      </div>

      {/* Unified Toolbar (filters + sort + count) */}
      <ContractsToolbar
        filters={filters}
        counts={counts}
        onFilterChange={setFilters}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
        totalCount={filteredContracts.length}
        searchQuery={searchQuery}
      />

      {/* Contract List */}
      {filteredContracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-6 py-12">
          {/* Empty icon */}
          <div className="text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          {/* Message */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchQuery ? 'No matching contracts' : 'No contracts found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'Try adjusting your search terms or filters'
                : "You don't have any contracts matching the current filters"}
            </p>
          </div>

          {/* Inline Toolbar in Empty State */}
          <ContractsToolbar
            filters={filters}
            counts={counts}
            onFilterChange={setFilters}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
            totalCount={filteredContracts.length}
            searchQuery={searchQuery}
          />
        </div>
      ) : isMobile ? (
        <MobileView contracts={filteredContracts} onDownload={handleDownload} />
      ) : (
        <DesktopView contracts={filteredContracts} onDownload={handleDownload} />
      )}
    </div>
  );
}
