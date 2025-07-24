// src/app/hub/page.tsx
'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  Share2,
  Users,
  Settings2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { HubDashboard } from '@/components/pages/hub/HubDashboard'
import { HubConnections } from '@/components/pages/hub/HubConnections'
import { HubParticipants } from '@/components/pages/hub/HubParticipants'
import { HubConfigurations } from '@/components/pages/hub/HubConfigurations'

const tabs = [
  { value: 'dashboard', label: 'Hub Dashboard', icon: LayoutDashboard },
  { value: 'connections', label: 'Connections', icon: Share2 },
  { value: 'participants', label: 'Participants', icon: Users },
  { value: 'configurations', label: 'Configurations', icon: Settings2 },
]

export default function HubPage() {
  const [selectedTab, setSelectedTab] = React.useState('dashboard')

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard': return <HubDashboard />
      case 'connections': return <HubConnections />
      case 'participants': return <HubParticipants />
      case 'configurations': return <HubConfigurations />
      default: return <HubDashboard />
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
