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
  TowerControl,
  Package,
  Projector,
  Sliders,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { DashboardPage } from '@/components/pages/infrastructure/InfrastructureDashboardPage'
import { ProjectsPage } from '@/components/pages/infrastructure/ProjectsPage'
import { MapPage } from '@/components/pages/infrastructure/MapPage'
import { HydroPollsPage } from '@/components/pages/infrastructure/HydroPollsPage'
import { FDHsPage } from '@/components/pages/infrastructure/FDHsPage'
import { FOSCsPage } from '@/components/pages/infrastructure/FOSCsPage'
import { PEDsPage } from '@/components/pages/infrastructure/PEDsPage'
import { SitesPage } from '@/components/pages/infrastructure/SitesPage'
import { VaultsPage } from '@/components/pages/infrastructure/VaultsPage'
import { DuctsPage } from '@/components/pages/infrastructure/DuctsPage'
import { AccessoriesPage } from '@/components/pages/infrastructure/AccessoriesPage'
import { SplittersPage } from '@/components/pages/infrastructure/SplittersPage'
import { TowersPage } from '@/components/pages/infrastructure/TowersPage'
import { CablesPage } from '@/components/pages/infrastructure/CablesPage'

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
    <div className="h-screen w-screen overflow-hidden bg-muted">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[240px] h-full overflow-y-auto p-4 border-r bg-muted/40 space-y-4">
          <div className="mb-4">
            <h2 className="text-sm font-semibold flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              Infrastructure
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