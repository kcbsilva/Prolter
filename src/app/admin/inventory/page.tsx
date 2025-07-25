// src/app/inventory/page.tsx
'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import {
  LayoutDashboard,
  Filter,
  Factory,
  Truck,
  Archive,
  Package,
  Warehouse,
  Bus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Dynamic imports for code splitting
const InventoryDashboard = dynamic(
  () => import('@/components/pages/inventory/InventoryDashboard').then(mod => mod.default),
  { loading: () => <div>Loading Dashboard...</div> }
)
const InventoryCategories = dynamic(
  () => import('@/components/pages/inventory/categories/InventoryCategories').then(mod => mod.default),
  { loading: () => <div>Loading Categories...</div> }
)
const InventoryManufacturer = dynamic(
  () => import('@/components/pages/inventory/manufacturers/InventoryManufacturer').then(mod => mod.default),
  { loading: () => <div>Loading Manufacturers...</div> }
)
const InventorySuppliers = dynamic(
  () => import('@/components/pages/inventory/suppliers/InventorySuppliers').then(mod => mod.default),
  { loading: () => <div>Loading Suppliers...</div> }
)
const InventoryProducts = dynamic(
  () => import('@/components/pages/inventory/products/InventoryProducts').then(mod => mod.default),
  { loading: () => <div>Loading Products...</div> }
)
const InventoryWarehouses = dynamic(
  () => import('@/components/pages/inventory/warehouses/InventoryWarehouses').then(mod => mod.default),
  { loading: () => <div>Loading Warehouses...</div> }
)
const InventoryVehicles = dynamic(
  () => import('@/components/pages/inventory/vehicles/InventoryVehicles').then(mod => mod.default),
  { loading: () => <div>Loading Vehicles...</div> }
)

type TabValue = 'dashboard' | 'categories' | 'manufacturers' | 'suppliers' | 'products' | 'warehouses' | 'vehicles'

const tabs = [
  { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { value: 'categories', label: 'Categories', icon: Filter },
  { value: 'manufacturers', label: 'Manufacturers', icon: Factory },
  { value: 'suppliers', label: 'Suppliers', icon: Truck },
  { value: 'products', label: 'Products', icon: Package },
  { value: 'warehouses', label: 'Warehouses', icon: Warehouse },
  { value: 'vehicles', label: 'Vehicles', icon: Bus },
] as const

export default function InventoryPage() {
  const [selectedTab, setSelectedTab] = React.useState<TabValue>('dashboard')

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
    dashboard: <InventoryDashboard />,
    categories: <InventoryCategories />,
    manufacturers: <InventoryManufacturer />,
    suppliers: <InventorySuppliers />,
    products: <InventoryProducts />,
    warehouses: <InventoryWarehouses />,
    vehicles: <InventoryVehicles />
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-muted">
      <div className="flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <aside 
          aria-label="Inventory navigation"
          className="w-[240px] h-full overflow-y-auto p-4 border-r bg-muted/40 space-y-4"
        >
          <div className="mb-4">
            <h2 className="text-sm font-semibold flex items-center">
              <Archive className="w-4 h-4 mr-2" />
              Inventory
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