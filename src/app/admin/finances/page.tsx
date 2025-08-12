'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { SidebarTabsLayout } from '@/components/layout/SidebarTabsLayout'
import {
  LayoutDashboard,
  DollarSign,
  BookOpen,
  Tag
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'


// Dynamic imports for performance
const FinanceDashboard = dynamic(
  () => import('@/components/pages/finances/FinanceDashboardPage').then(mod => mod.default),
  { loading: () => <div>Loading Dashboard...</div> }
)
const CashBookPage = dynamic(
  () => import('@/components/pages/finances/CashBookPage').then(mod => mod.default),
  { loading: () => <div>Loading Cash Book...</div> }
)
const EntryCategoriesPage = dynamic(
  () => import('@/components/pages/finances/EntryCategoriesPage').then(mod => mod.default),
  { loading: () => <div>Loading Categories...</div> }
)

export default function FinancesPage() {
  const tabs = [
    { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { value: 'cash-book', label: 'Cash Book', icon: DollarSign },
    { value: 'entry-categories', label: 'Entry Categories', icon: Tag }
  ] as { value: string; label: string; icon: LucideIcon }[]

  const componentMap = {
    dashboard: <FinanceDashboard />,
    'cash-book': <CashBookPage />,
    'entry-categories': <EntryCategoriesPage />
  }

  return (
    <SidebarTabsLayout
      title="Finances"
      titleIcon={BookOpen}
      tabs={tabs}
      defaultTab="dashboard"
      componentMap={componentMap}
    />
  )
}
