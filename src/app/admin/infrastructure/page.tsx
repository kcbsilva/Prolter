'use client'

import {
  LayoutDashboard,
  Map,
  Landmark,
  Boxes,
  Split,
  Cable,
  Vault,
  Settings,
  TowerControl,
  Package,
  Projector,
  Sliders
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { SidebarTabsLayout } from '@/components/layout/SidebarTabsLayout'

const InfrastructureDashboardPage = dynamic(() => import('@/components/pages/infrastructure/InfrastructureDashboardPage').then(m => m.default))
const ProjectsPage = dynamic(() => import('@/components/pages/infrastructure/ProjectsPage').then(m => m.default))
const MapPage = dynamic(() => import('@/components/pages/infrastructure/MapPage').then(m => m.default))
const HydroPollsPage = dynamic(() => import('@/components/pages/infrastructure/HydroPollsPage').then(m => m.default))
const FDHsPage = dynamic(() => import('@/components/pages/infrastructure/FDHsPage').then(m => m.default))
const FOSCsPage = dynamic(() => import('@/components/pages/infrastructure/FOSCsPage').then(m => m.default))
const PEDsPage = dynamic(() => import('@/components/pages/infrastructure/PEDsPage').then(m => m.default))
const SitesPage = dynamic(() => import('@/components/pages/infrastructure/SitesPage').then(m => m.default))
const VaultsPage = dynamic(() => import('@/components/pages/infrastructure/VaultsPage').then(m => m.default))
const DuctsPage = dynamic(() => import('@/components/pages/infrastructure/DuctsPage').then(m => m.default))
const AccessoriesPage = dynamic(() => import('@/components/pages/infrastructure/AccessoriesPage').then(m => m.default))
const SplittersPage = dynamic(() => import('@/components/pages/infrastructure/SplittersPage').then(m => m.default))

export default function InfrastructurePage() {
  const tabs = [
    { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { value: 'projects', label: 'Projects', icon: Projector },
    { value: 'map', label: 'Map', icon: Map },
    { value: 'hydropolls', label: 'Hydro Polls', icon: TowerControl },
    { value: 'fdhs', label: 'FDHs', icon: Landmark },
    { value: 'foscs', label: 'FOSCs', icon: Cable },
    { value: 'peds', label: 'PEDs', icon: Package },
    { value: 'sites', label: 'Sites', icon: Sliders },
    { value: 'vaults', label: 'Vaults', icon: Vault },
    { value: 'ducts', label: 'Ducts', icon: Boxes },
    { value: 'accessories', label: 'Accessories', icon: Settings },
    { value: 'splitters', label: 'Splitters', icon: Split }
  ]

  const componentMap = {
    dashboard: <InfrastructureDashboardPage />,
    projects: <ProjectsPage />,
    map: <MapPage />,
    hydropolls: <HydroPollsPage />,
    fdhs: <FDHsPage />,
    foscs: <FOSCsPage />,
    peds: <PEDsPage />,
    sites: <SitesPage />,
    vaults: <VaultsPage />,
    ducts: <DuctsPage />,
    accessories: <AccessoriesPage />,
    splitters: <SplittersPage />
  }

  return (
    <SidebarTabsLayout
      title="Infrastructure"
      titleIcon={LayoutDashboard}
      tabs={tabs}
      defaultTab="dashboard"
      componentMap={componentMap}
    />
  )
}
