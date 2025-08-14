// src/app/sales/page.tsx
'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Dynamic imports for code splitting
const SalesDashboard = dynamic(
  () => import('@/components/pages/sales/SalesDashboard').then(mod => mod.default),
  { loading: () => <div>Loading Dashboard...</div> }
)
const SalesLeads = dynamic(
  () => import('@/components/pages/sales/leads/SalesLeads').then(mod => mod.default),
  { loading: () => <div>Loading Leads...</div> }
)
const SalesOpportunities = dynamic(
  () => import('@/components/pages/sales/opportunities/SalesOpportunities').then(mod => mod.default),
  { loading: () => <div>Loading Opportunities...</div> }
)
const SalesProposals = dynamic(
  () => import('@/components/pages/sales/proposals/SalesProposals').then(mod => mod.default),
  { loading: () => <div>Loading Proposals...</div> }
)

type TabValue = 'dashboard' | 'leads' | 'opportunities' | 'proposals'

const tabs = [
  { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { value: 'leads', label: 'Leads', icon: Users },
  { value: 'opportunities', label: 'Opportunities', icon: TrendingUp },
  { value: 'proposals', label: 'Proposals', icon: FileText },
] as const

export default function SalesPage() {
  const [selectedTab, setSelectedTab] = React.useState<TabValue>('dashboard')

  // Sync tab state with URL hash
  React.useEffect(() => {
    const hash = window.location.hash.substring(1)
    if (hash && tabs.some(tab => tab.value === hash)) {
      setSelectedTab(hash as TabValue)
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.substring(1)
      if (newHash && tabs.some(tab => tab.value === newHash)) {
        setSelectedTab(newHash as TabValue)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleTabChange = (tab: TabValue) => {
    setSelectedTab(tab)
    window.location.hash = tab
  }

  const componentMap: Record<TabValue, React.ReactNode> = {
    dashboard: <SalesDashboard />,
    leads: <SalesLeads />,
    opportunities: <SalesOpportunities />,
    proposals: <SalesProposals />
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <aside
          aria-label="Sales navigation"
          className="w-[240px] h-full overflow-y-auto border-r bg-gradient-to-b from-muted/60 to-muted/30 backdrop-blur-sm rounded-tl-xl"
        >
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              Sales
            </h2>
          </div>

          <nav className="p-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = selectedTab === tab.value
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${tab.value}`}
                  onClick={() => handleTabChange(tab.value)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isActive
                      ? 'bg-primary/10 text-primary border-l-4 border-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:pl-4'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors duration-150',
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          id={`tabpanel-${selectedTab}`}
          aria-labelledby={`tab-${selectedTab}`}
          className="flex-1 min-w-0 h-full overflow-y-auto p-6 bg-background"
        >
          {componentMap[selectedTab]}
        </main>
      </div>
    </div>
  )
}
