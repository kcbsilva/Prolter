// src/components/client/contracts/ContractsToolbar.tsx
'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/shared/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/shared/ui/toggle-group';

interface ContractsToolbarProps {
  filters: { active: boolean; inactive: boolean };
  counts: { active: number; inactive: number };
  onFilterChange: (filters: { active: boolean; inactive: boolean }) => void;
  sortBy: 'paymentDue' | 'startDate' | 'id';
  sortOrder: 'asc' | 'desc';
  onSortByChange: (sortBy: 'paymentDue' | 'startDate' | 'id') => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  totalCount: number;
  searchQuery?: string;
}

export function ContractsToolbar({
  filters,
  counts,
  onFilterChange,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  totalCount,
  searchQuery,
}: ContractsToolbarProps) {
  const value = [
    filters.active ? 'active' : null,
    filters.inactive ? 'inactive' : null,
  ].filter(Boolean) as string[];

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="flex flex-col md:flex-row md:items-center gap-4 p-4">
        {/* Active/Inactive filter */}
        <ToggleGroup
          type="multiple"
          value={value}
          onValueChange={(vals: string[]) =>
            onFilterChange({
              active: vals.includes('active'),
              inactive: vals.includes('inactive'),
            })
          }
          className="flex gap-2"
        >
          <ToggleGroupItem
            value="active"
            className="rounded-full px-3 py-1 text-xs font-medium data-[state=on]:bg-green-500 data-[state=on]:text-white"
          >
            Active <span className="ml-1 opacity-80">({counts.active})</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="inactive"
            className="rounded-full px-3 py-1 text-xs font-medium data-[state=on]:bg-gray-400 data-[state=on]:text-white"
          >
            Inactive <span className="ml-1 opacity-80">({counts.inactive})</span>
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Sorting */}
        <div className="flex flex-wrap items-center gap-2 md:ml-auto">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'paymentDue' | 'startDate' | 'id')}
            className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="paymentDue">Payment Due Date</option>
            <option value="startDate">Start Date</option>
            <option value="id">Contract ID</option>
          </select>

          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-white transition-colors flex items-center gap-1"
          >
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>

          {/* Count */}
          <span className="text-sm text-gray-600 ml-auto">
            {totalCount} contract{totalCount !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
