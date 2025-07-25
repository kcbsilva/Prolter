// src/app/messenger/page.tsx
'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import {
  MessageSquare,
  Users,
  Hash,
  GitPullRequest,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Dynamic imports for code splitting
const MessengerChat = dynamic(
  () => import('@/components/pages/messenger/chat/MessengerChat').then(mod => mod.default),
  { loading: () => <div>Loading Chat...</div> }
)
const MessengerDepartments = dynamic(
  () => import('@/components/pages/messenger/departments/MessengerDepartments').then(mod => mod.default),
  { loading: () => <div>Loading Departments...</div> }
)
const MessengerChannels = dynamic(
  () => import('@/components/pages/messenger/channels/MessengerChannels').then(mod => mod.default),
  { loading: () => <div>Loading Channels...</div> }
)
const MessengerFlow = dynamic(
  () => import('@/components/pages/messenger/flow/MessengerFlow').then(mod => mod.default),
  { loading: () => <div>Loading Flows...</div> }
)
const MessengerConfigure = dynamic(
  () => import('@/components/pages/messenger/configure/MessengerConfigure').then(mod => mod.default),
  { loading: () => <div>Loading Configuration...</div> }
)

type TabValue = 'chat' | 'departments' | 'channels' | 'flow' | 'configure'

const tabs = [
  { value: 'chat', label: 'Chat', icon: MessageSquare },
  { value: 'departments', label: 'Departments', icon: Users },
  { value: 'channels', label: 'Channels', icon: Hash },
  { value: 'flow', label: 'Flow', icon: GitPullRequest },
  { value: 'configure', label: 'Configure', icon: Settings },
] as const

export default function MessengerPage() {
  const [selectedTab, setSelectedTab] = React.useState<TabValue>('chat')

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
    chat: <MessengerChat />,
    departments: <MessengerDepartments />,
    channels: <MessengerChannels />,
    flow: <MessengerFlow />,
    configure: <MessengerConfigure />
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-muted">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <aside 
          aria-label="Messenger navigation"
          className="w-[240px] h-full overflow-y-auto p-4 border-r bg-muted/40 space-y-4"
        >
          <div className="mb-4">
            <h2 className="text-sm font-semibold flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messenger
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
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${tab.value}`}
                  className={cn(
                    'w-full justify-start font-normal text-xs rounded-lg pl-5',
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                  )}
                  onClick={() => handleTabChange(tab.value)}
                >
                  <Icon className="w-3 h-3 mr-2" />
                  {tab.label}
                </Button>
              )
            })}
          </div>
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