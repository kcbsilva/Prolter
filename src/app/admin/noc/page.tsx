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
  Router
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    items: [
      { value: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    ],
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
]

export default function NOCPage() {
  const [selectedTab, setSelectedTab] = React.useState('overview')

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview': return <NocOverview />
      case 'fttx': return <FTTxDashboard />
      case 'olts': return <OLTsONXs />
      case 'templates': return <OnxTemplates />
      case 'wireless': return <WirelessDashboard />
      case 'aps': return <AccessPoints />
      case 'cpes': return <CPEs />
      case 'devices': return <DevicesDashboard />
      case 'routers': return <NocRouters />
      case 'switches': return <NocSwitches />

      default: return <NocOverview />
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-muted">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[240px] h-full overflow-y-auto p-4 border-r bg-muted/40 space-y-4">
          <div className="mb-4">
            <h2 className="text-sm font-semibold flex items-center">
              <Network className="w-4 h-4 mr-2" />
              NOC
            </h2>
          </div>

          {tabGroups.map((group) => (
            <fieldset
              key={group.label}
              className="rounded-md p-3 space-y-2 bg-muted/10 shadow-sm border border-muted-foreground/10"
            >
              <legend className="px-2 text-xs text-muted-foreground font-medium">
                <div className="flex items-center">
                  {group.icon && <group.icon className="w-3 h-3 mr-2" />}
                  {group.label}
                </div>
              </legend>
              <div className="space-y-1 pt-1">
                {group.items.map((tab) => {
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
            </fieldset>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-6 bg-white">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}