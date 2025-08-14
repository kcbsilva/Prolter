// src/components/layouts/SidebarTabsLayout.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabItem {
  value: string
  label: string
  icon: React.ElementType
}

interface SidebarTabsLayoutProps {
  title: string
  titleIcon: React.ElementType
  tabs: TabItem[]
  defaultTab: string
  componentMap: Record<string, React.ReactNode>
}

export function SidebarTabsLayout({
  title,
  titleIcon: TitleIcon,
  tabs,
  defaultTab,
  componentMap
}: SidebarTabsLayoutProps) {
  const [selectedTab, setSelectedTab] = React.useState<string>(defaultTab)

  // Sync with hash
  React.useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash && tabs.some(tab => tab.value === hash)) setSelectedTab(hash)

    const onHash = () => {
      const newHash = window.location.hash.slice(1)
      if (newHash && tabs.some(tab => tab.value === newHash)) setSelectedTab(newHash)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [tabs])

  const handleTabChange = (tabValue: string) => {
    setSelectedTab(tabValue)
    window.location.hash = tabValue
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <aside
          aria-label={`${title} navigation`}
          className={cn(
            'w-[240px] h-full overflow-y-auto rounded-tl-xl',
            // Glass effect (works in light/dark because it uses your CSS vars)
            // 1) translucent background so blur shows
            'bg-background/55 supports-[backdrop-filter]:bg-background/45',
            // 2) actual blur + a bit of saturation pop
            'backdrop-blur-md backdrop-saturate-150',
            // 3) subtle separation from content
            'border-r border-border/60 ring-1 ring-inset ring-border/40'
          )}
        >
          <div className="p-4 border-b border-border/60">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <TitleIcon className="w-4 h-4 text-primary" />
              {title}
            </h2>
          </div>

          <nav className="p-3 space-y-1">
            {tabs.map(({ value, label, icon: Icon }) => {
              const isActive = selectedTab === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleTabChange(value)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 group',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isActive
                      ? 'bg-primary/10 text-primary border-l-4 border-primary'
                      : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground hover:pl-4'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors duration-150',
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  {label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-6 bg-background">
          {componentMap[selectedTab]}
        </main>
      </div>
    </div>
  )
}
