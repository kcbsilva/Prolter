// src/app/service-calls/page.tsx
'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  ListChecks,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { ServiceCallsDashboard } from '@/components/pages/service-calls/ServiceCallsDashboard'
import { ServiceCallsTypes } from '@/components/pages/service-calls/ServiceCallsTypes'

const tabs = [
  { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { value: 'types', label: 'Service Types', icon: ListChecks },
]

export default function ServiceCalls() {
  const [selectedTab, setSelectedTab] = React.useState('dashboard')

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard': return <ServiceCallsDashboard />
      case 'types': return <ServiceCallsTypes />
      default: return <ServiceCallsDashboard />
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-muted">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[240px] h-full overflow-y-auto p-4 border-r bg-muted/40 space-y-4">
          <div className="mb-4">
            <h2 className="text-sm font-semibold flex items-center">
              <Wrench className="w-4 h-4 mr-2" />
              Service Calls
            </h2>
          </div>

          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = selectedTab === tab.value
              return (
                <Button
                  key={tab.value}
                  variant="ghost"
                  className={cn(
                    'w-full justify-start font-normal text-xs rounded-lg pl-5',
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                  )}
                  onClick={() => setSelectedTab(tab.value)}
                >
                  <Icon className="w-3 h-3 mr-2" />
                  {tab.label}
                </Button>
              )
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-6 bg-white">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}