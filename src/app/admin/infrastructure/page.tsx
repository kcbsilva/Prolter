// src/app/infrastructure/page.tsx
'use client'

import * as React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ProjectsPage } from '@/app/admin/infrastructure/projects'
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

export default function InfrastructurePage() {
  const [selectedTab, setSelectedTab] = React.useState('projects')

  return (
    <div className="p-4">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-4 gap-2 mb-6">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="hydro">Hydro Polls</TabsTrigger>
          <TabsTrigger value="fdhs">FDHs</TabsTrigger>
          <TabsTrigger value="foscs">FOSCs</TabsTrigger>
          <TabsTrigger value="peds">PEDs</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="vaults">Vaults</TabsTrigger>
          <TabsTrigger value="ducts">Ducts</TabsTrigger>
          <TabsTrigger value="accessories">Accessories</TabsTrigger>
          <TabsTrigger value="splitters">Splitters</TabsTrigger>
          <TabsTrigger value="towers">Towers</TabsTrigger>
          <TabsTrigger value="cables">Cables</TabsTrigger>
        </TabsList>

        <TabsContent value="projects"><ProjectsPage /></TabsContent>
        <TabsContent value="map"><MapPage /></TabsContent>
        <TabsContent value="hydro"><HydroPollsPage /></TabsContent>
        <TabsContent value="fdhs"><FDHsPage /></TabsContent>
        <TabsContent value="foscs"><FOSCsPage /></TabsContent>
        <TabsContent value="peds"><PEDsPage /></TabsContent>
        <TabsContent value="sites"><SitesPage /></TabsContent>
        <TabsContent value="vaults"><VaultsPage /></TabsContent>
        <TabsContent value="ducts"><DuctsPage /></TabsContent>
        <TabsContent value="accessories"><AccessoriesPage /></TabsContent>
        <TabsContent value="splitters"><SplittersPage /></TabsContent>
        <TabsContent value="towers"><TowersPage /></TabsContent>
        <TabsContent value="cables"><CablesPage /></TabsContent>
      </Tabs>
    </div>
  )
}
