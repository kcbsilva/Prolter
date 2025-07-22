// src/app/finances/page.tsx
'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  BookText,
  Settings,
  List,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { FinanceDashboardPage } from '@/components/finances/FinanceDashboardPage'
import { CashBookPage } from '@/components/finances/CashBookPage'
import { EntryCategoriesPage } from '@/components/finances/EntryCategoriesPage'
import { FinancialConfigPage } from '@/components/finances/FinancialConfigPage'

const tabs = [
  { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { value: 'cashbook', label: 'Cash Book', icon: BookText },
  { value: 'entrycategories', label: 'Entry Categories', icon: List },
  { value: 'configurations', label: 'Financial Configurations', icon: Settings },
]

export default function FinancialPage() {
  const [selectedTab, setSelectedTab] = React.useState('dashboard')

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard': return <FinanceDashboardPage />
      case 'cashbook': return <CashBookPage />
      case 'entrycategories': return <EntryCategoriesPage />
      case 'configurations': return <FinancialConfigPage />
      default: return <FinanceDashboardPage />
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-muted">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[240px] h-full overflow-y-auto p-4 border-r bg-muted/40 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = selectedTab === tab.value
            return (
              <Button
                key={tab.value}
                variant="ghost"
                className={cn(
                  'w-full justify-start font-normal text-sm rounded-lg',
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                )}
                onClick={() => setSelectedTab(tab.value)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            )
          })}
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-6 bg-white">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
