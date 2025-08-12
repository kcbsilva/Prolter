// src/app/noc/page.tsx
'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  Wifi,
  Radio,
  Cable,
  FileTerminal,
  ChevronsLeftRightEllipsis,
  Network,
  EthernetPort,
  Router,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { NocOverview } from '@/components/pages/noc/overview'
import { FTTxDashboard } from '@/components/pages/noc/fttx/FttxDashboard'
import { OLTsONXs } from '@/components/pages/noc/fttx/FttxOltsOnxs'
import { OnxTemplates } from '@/components/pages/noc/fttx/FttxOnxTemplates'
import { WirelessDashboard } from '@/components/pages/noc/wireless/WirelessDashboard'
import { AccessPoints } from '@/components/pages/noc/wireless/WirelessAccessPoint'
import { CPEs } from '@/components/pages/noc/wireless/WirelessCPEs'
import { DevicesDashboard } from '@/components/pages/noc/devices/DevicesDashboard'
import { NocRouters } from '@/components/pages/noc/devices/NocRouters'
import { NocSwitches } from '@/components/pages/noc/devices/NocSwitches'

const tabGroups = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    items: [{ value: 'overview', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'FTTx',
    icon: Cable,
    items: [
      { value: 'fttx', label: 'FTTx Dashboard', icon: LayoutDashboard },
      { value: 'olts', label: 'OLTs / ONXs', icon: EthernetPort },
      { value: 'templates', label: 'ONx Templates', icon: FileTerminal },
    ],
  },
  {
    label: 'Wireless',
    icon: Wifi,
    items: [
      { value: 'wireless', label: 'Wireless Dashboard', icon: LayoutDashboard },
      { value: 'aps', label: 'Access Points', icon: Radio },
      { value: 'cpes', label: 'CPEs', icon: Router },
    ],
  },
  {
    label: 'Devices',
    icon: Network,
    items: [
      { value: 'devices', label: 'Devices Dashboard', icon: LayoutDashboard },
      { value: 'routers', label: 'Routers', icon: Router },
      { value: 'switches', label: 'Switches', icon: ChevronsLeftRightEllipsis },
    ],
  },
] as const

export default function NOCPage() {
  const [selectedTab, setSelectedTab] = React.useState('overview')

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return <NocOverview />
      case 'fttx':
        return <FTTxDashboard />
      case 'olts':
        return <OLTsONXs />
      case 'templates':
        return <OnxTemplates />
      case 'wireless':
        return <WirelessDashboard />
      case 'aps':
        return <AccessPoints />
      case 'cpes':
        return <CPEs />
      case 'devices':
        return <DevicesDashboard />
      case 'routers':
        return <NocRouters />
      case 'switches':
        return <NocSwitches />
      default:
        return <NocOverview />
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[240px] h-full overflow-y-auto border-r bg-gradient-to-b from-muted/60 to-muted/30 backdrop-blur-sm rounded-tl-xl">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Network className="w-4 h-4 text-primary" />
              NOC
            </h2>
          </div>

          <nav className="p-3 space-y-4" aria-label="NOC navigation">
            {tabGroups.map((group) => {
              const GroupIcon = group.icon
              return (
                <fieldset
                  key={group.label}
                  className="rounded-md border border-border/50 bg-muted/10 shadow-sm"
                >
                  <legend className="px-2">
                    <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      {GroupIcon && <GroupIcon className="w-3 h-3" />}
                      {group.label}
                    </span>
                  </legend>

                  <div
                    className="p-2 pt-1 space-y-1"
                    role="tablist"
                    aria-label={`${group.label} tabs`}
                  >
                    {group.items.map((tab) => {
                      const Icon = tab.icon
                      const isActive = selectedTab === tab.value
                      return (
                        <button
                          key={tab.value}
                          id={`tab-${tab.value}`}
                          role="tab"
                          aria-selected={isActive}
                          aria-controls={`tabpanel-${tab.value}`}
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
                              isActive
                                ? 'text-primary'
                                : 'text-muted-foreground group-hover:text-foreground'
                            )}
                          />
                          {tab.label}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          id={`tabpanel-${selectedTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${selectedTab}`}
          className="flex-1 min-w-0 h-full overflow-y-auto p-6 bg-background"
        >
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
