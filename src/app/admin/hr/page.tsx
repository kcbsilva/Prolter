// src/app/hr/page.tsx
'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import {
  LayoutDashboard,
  Users,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Dynamic imports for code splitting
const HRDashboard = dynamic(
  () => import('@/components/pages/hr/HRDashboard').then(mod => mod.default),
  { loading: () => <div>Loading Dashboard...</div> }
)
const HREmployees = dynamic(
  () => import('@/components/pages/hr/employees/HREmployees').then(mod => mod.default),
  { loading: () => <div>Loading Employees...</div> }
)
const HRTimeSheets = dynamic(
  () => import('@/components/pages/hr/timesheets/HRTimeSheets').then(mod => mod.default),
  { loading: () => <div>Loading Time Sheets...</div> }
)

type TabValue = 'dashboard' | 'employees' | 'timesheets'

const tabs = [
  { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { value: 'employees', label: 'Employees', icon: Users },
  { value: 'timesheets', label: 'Time Sheets', icon: Clock },
] as const

export default function HRPage() {
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
    dashboard: <HRDashboard />,
    employees: <HREmployees />,
    timesheets: <HRTimeSheets />
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-muted">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <aside 
          aria-label="HR navigation"
          className="w-[240px] h-full overflow-y-auto p-4 border-r bg-muted/40 space-y-1"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = selectedTab === tab.value
            return (
              <Button
                key={tab.value}
                variant="ghost"
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.value}`}
                className={cn(
                  'w-full justify-start font-normal text-sm rounded-lg',
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                )}
                onClick={() => handleTabChange(tab.value)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            )
          })}
        </aside>

        {/* Main Content */}
        <main 
          id={`tabpanel-${selectedTab}`}
          aria-labelledby={`tab-${selectedTab}`}
          className="flex-1 min-w-0 h-full overflow-y-auto p-6 bg-white"
        >
          {componentMap[selectedTab]}
        </main>
      </div>
    </div>
  )
}