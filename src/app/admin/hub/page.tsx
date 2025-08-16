// src/app/hub/page.tsx
'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  Share2,
  Users,
  Settings2,
  Webhook,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { HubDashboard } from '@/components/admin/pages/hub/HubDashboard'
import { HubConnections } from '@/components/admin/pages/hub/HubConnections'
import { HubParticipants } from '@/components/admin/pages/hub/HubParticipants'
import { HubConfigurations } from '@/components/admin/pages/hub/HubConfigurations'

const tabs = [
  { value: 'dashboard', label: 'Hub Dashboard', icon: LayoutDashboard },
  { value: 'connections', label: 'Connections', icon: Share2 },
  { value: 'participants', label: 'Participants', icon: Users },
  { value: 'configurations', label: 'Configurations', icon: Settings2 },
] as const

export default function HubPage() {
  const [selectedTab, setSelectedTab] = React.useState<(typeof tabs)[number]['value']>('dashboard')

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
    <div className="h-screen w-screen overflow-hidden bg-background">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[240px] h-full overflow-y-auto border-r bg-gradient-to-b from-muted/60 to-muted/30 backdrop-blur-sm rounded-tl-xl">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Webhook className="w-4 h-4 text-primary" />
              Hub
            </h2>
          </div>

          <nav className="p-3 space-y-1" aria-label="Hub navigation">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = selectedTab === tab.value
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setSelectedTab(tab.value)}
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
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-6 bg-background">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
