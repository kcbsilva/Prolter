// src/app/inventory/page.tsx
'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  Filter,
  Factory,
  Truck,
  Package,
  Warehouse,
  Bus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { InventoryDashboard } from '@/components/pages/inventory/InventoryDashboard'
import { InventoryCategories } from '@/components/pages/inventory/categories/InventoryCategories'
import { InventoryManufacturer } from '@/components/pages/inventory/manufacturers/InventoryManufacturer'
import { InventorySuppliers } from '@/components/pages/inventory/suppliers/InventorySuppliers'
import { InventoryProducts } from '@/components/pages/inventory/products/InventoryProducts'
import { InventoryWarehouses } from '@/components/pages/inventory/warehouses/InventoryWarehouses'
import { InventoryVehicles } from '@/components/pages/inventory/vehicles/InventoryVehicles'

const tabs = [
  { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { value: 'categories', label: 'Categories', icon: Filter },
  { value: 'manufacturers', label: 'Manufacturers', icon: Factory },
  { value: 'suppliers', label: 'Suppliers', icon: Truck },
  { value: 'products', label: 'Products', icon: Package },
  { value: 'warehouses', label: 'Warehouses', icon: Warehouse },
  { value: 'vehicles', label: 'Vehicles', icon: Bus },
]

export default function InventoryPage() {
  const [selectedTab, setSelectedTab] = React.useState('dashboard')

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard': return <InventoryDashboard />
      case 'categories': return <InventoryCategories />
      case 'manufacturers': return <InventoryManufacturer />
      case 'suppliers': return <InventorySuppliers />
      case 'products': return <InventoryProducts />
      case 'warehouses': return <InventoryWarehouses />
      case 'vehicles': return <InventoryVehicles />
      default: return <InventoryDashboard />
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
