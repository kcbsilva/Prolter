// src/app/noc/page.tsx
'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  Wifi,
  Radio,
  SatelliteDish,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { NocOverview } from '@/components/noc/overview'
import { FTTxDashboard } from '@/components/noc/fttx/FTTxDashboard'
import { OLTsONXs } from '@/components/noc/fttx/FttxOltsOnxs'
import { WirelessDashboard } from '@/components/noc/wireless/WirelessDashboard'
import { AccessPoints } from '@/components/noc/wireless/WirelessAccessPoint'
import { CPEs } from '@/components/noc/wireless/WirelessCPEs'

const tabs = [
  { value: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { value: 'fttx', label: 'FTTx Dashboard', icon: Wifi },
  { value: 'olts', label: 'OLTs', icon: Radio },
  { value: 'wireless', label: 'Wireless Dashboard', icon: Wifi },
  { value: 'aps', label: 'Access Points', icon: Radio },
  { value: 'cpes', label: 'CPEs', icon: SatelliteDish },
]

export default function NOCPage() {
  const [selectedTab, setSelectedTab] = React.useState('dashboard')

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview': return <NocOverview />
      case 'fttx': return <FTTxDashboard />
      case 'olts': return <OLTsONXs />
      case 'wireless': return <WirelessDashboard />
      case 'aps': return <AccessPoints />
      case 'cpes': return <CPEs />
      default: return <NocOverview />
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
