// src/components/subscribers/ClientBar.tsx
'use client'

import React from 'react'
import { Input } from '@/components/shared/ui/input'
import { Button } from '@/components/shared/ui/button'
import { Plus } from 'lucide-react'

interface ClientBarProps {
  total: number
  search: string
  onSearchChange: (value: string) => void
  statusFilter: ('Active' | 'Suspended' | 'Inactive')[]
  onStatusChange: (status: ('Active' | 'Suspended' | 'Inactive')[]) => void
  onAdd: () => void
}

export function ClientBar({
  total,
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onAdd,
}: ClientBarProps) {
  const filters = [
    { label: 'Active', color: 'bg-green-600' },
    { label: 'Suspended', color: 'bg-orange-500' },
    { label: 'Inactive', color: 'bg-gray-400' },
  ]

  const handleToggle = (label: 'Active' | 'Suspended' | 'Inactive') => {
    const isActive = statusFilter.includes(label)
    const updated = isActive
      ? statusFilter.filter((s) => s !== label)
      : [...statusFilter, label]
    onStatusChange(updated)
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 flex-wrap mb-4">
      {/* Left: Count */}
      <div className="text-sm text-muted-foreground min-w-fit">
        {total} subscriber{total === 1 ? '' : 's'} found
      </div>

      {/* Middle: Search */}
      <div className="relative w-full max-w-xs mx-auto flex-1">
        {/* 🔍 Search Icon */}
        <span
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-transform duration-200
          ${search.length > 0 ? 'scale-90 opacity-30' : 'scale-100 opacity-100'}
          text-muted-foreground pointer-events-none`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>

        {/* ❌ Clear Button */}
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Input */}
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email..."
          className="pl-8 pr-8 py-1.5 rounded-full border border-black text-sm
          bg-white text-black placeholder:text-muted-foreground
          focus-visible:ring-2 focus-visible:ring-black/40
          dark:bg-neutral-900 dark:text-white dark:border-white/60 dark:placeholder:text-neutral-400"
        />
      </div>

      {/* Right: Filters + Add */}
      <div className="flex items-center gap-2 flex-wrap justify-end">
        {filters.map(({ label, color }) => {
          const isActive = statusFilter.includes(label as any)
          return (
            <Button
              key={label}
              size="sm"
              variant="ghost"
              aria-pressed={isActive}
              onClick={() => handleToggle(label as any)}
              className={`flex items-center gap-2 border rounded-md px-3 py-1.5
                ${isActive ? 'bg-[#E5E5E5]' : 'bg-white'} border-black text-black hover:bg-[#E5E5E5]
                dark:bg-neutral-800 dark:text-white dark:border-white dark:hover:bg-neutral-700`}
            >
              <span
                className={`h-3 w-3 rounded-full ${color} ${isActive ? 'animate-pulse' : ''}`}
              />
              {label}
            </Button>
          )
        })}

        {/* Clear Filters */}
        {statusFilter.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onStatusChange([])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear Filters
          </Button>
        )}

        {/* Add Client */}
        <Button
          size="sm"
          onClick={onAdd}
          className="border border-black rounded-md bg-white text-black hover:bg-[#E5E5E5]
            dark:bg-neutral-800 dark:text-white dark:border-white dark:hover:bg-neutral-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>
    </div>
  )
}
