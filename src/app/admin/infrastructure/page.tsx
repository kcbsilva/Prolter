// src/app/infrastructure/page.tsx
'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  Map,
  Layers,
  Landmark,
  Boxes,
  Split,
  Cable,
  Vault,
  Settings,
  TowerControl,
  Package,
  Projector,
  Sliders,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { DashboardPage } from '@/components/infrastructure/InfrastructureDashboardPage'
import { ProjectsPage } from '@/components/infrastructure/ProjectsPage'
import { MapPage } from '@/components/infrastructure/MapPage'
import { HydroPollsPage } from '@/components/infrastructure/HydroPollsPage'
import { FDHsPage } from '@/components/infrastructure/FDHsPage'
import { FOSCsPage } from '@/components/infrastructure/FOSCsPage'
import { PEDsPage } from '@/components/infrastructure/PEDsPage'
import { SitesPage } from '@/components/infrastructure/SitesPage'
import { VaultsPage } from '@/components/infrastructure/VaultsPage'
import { DuctsPage } from '@/components/infrastructure/DuctsPage'
import { AccessoriesPage } from '@/components/infrastructure/AccessoriesPage'
import { SplittersPage } from '@/components/infrastructure/SplittersPage'
import { TowersPage } from '@/components/infrastructure/TowersPage'
import { CablesPage } from '@/components/infrastructure/CablesPage'

const tabs = [
  { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { value: 'projects', label: 'Projects', icon: Projector },
  { value: 'map', label: 'Map', icon: Map },
  { value: 'hydro', label: 'Hydro Polls', icon: Landmark },
  { value: 'fdhs', label: 'FDHs', icon: Boxes },
  { value: 'foscs', label: 'FOSCs', icon: Layers },
  { value: 'peds', label: 'PEDs', icon: Sliders },
  { value: 'sites', label: 'Sites', icon: Landmark },
  { value: 'vaults', label: 'Vaults', icon: Vault },
  { value: 'ducts', label: 'Ducts', icon: Cable },
  { value: 'accessories', label: 'Accessories', icon: Package },
  { value: 'splitters', label: 'Splitters', icon: Split },
  { value: 'towers', label: 'Towers', icon: TowerControl },
  { value: 'cables', label: 'Cables', icon: Cable },
]

export default function InfrastructurePage() {
  const [selectedTab, setSelectedTab] = React.useState('dashboard')

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard': return <DashboardPage />
      case 'projects': return <ProjectsPage />
      case 'map': return <MapPage />
      case 'hydro': return <HydroPollsPage />
      case 'fdhs': return <FDHsPage />
      case 'foscs': return <FOSCsPage />
      case 'peds': return <PEDsPage />
      case 'sites': return <SitesPage />
      case 'vaults': return <VaultsPage />
      case 'ducts': return <DuctsPage />
      case 'accessories': return <AccessoriesPage />
      case 'splitters': return <SplittersPage />
      case 'towers': return <TowersPage />
      case 'cables': return <CablesPage />
      default: return <DashboardPage />
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <div className="flex h-[700px] w-[1200px] overflow-hidden rounded-2xl shadow-md border bg-white">
        {/* Sidebar */}
        <aside className="w-[800px] p-4 border-r bg-muted/40 space-y-1">
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
        <main className="flex-1 p-6 overflow-y-auto bg-white">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
