'use client'

import {
  LayoutDashboard,
  Filter,
  Factory,
  Truck,
  Package,
  Warehouse,
  Bus
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { SidebarTabsLayout } from '@/components/layout/SidebarTabsLayout'

const InventoryDashboard = dynamic(() => import('@/components/pages/inventory/InventoryDashboard').then(m => m.default))
const InventoryCategories = dynamic(() => import('@/components/pages/inventory/categories/InventoryCategories').then(m => m.default))
const InventoryManufacturer = dynamic(() => import('@/components/pages/inventory/manufacturers/InventoryManufacturer').then(m => m.default))
const InventorySuppliers = dynamic(() => import('@/components/pages/inventory/suppliers/InventorySuppliers').then(m => m.default))
const InventoryProducts = dynamic(() => import('@/components/pages/inventory/products/InventoryProducts').then(m => m.default))
const InventoryWarehouses = dynamic(() => import('@/components/pages/inventory/warehouses/InventoryWarehouses').then(m => m.default))
const InventoryVehicles = dynamic(() => import('@/components/pages/inventory/vehicles/InventoryVehicles').then(m => m.default))

export default function InventoryPage() {
  const tabs = [
    { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { value: 'categories', label: 'Categories', icon: Filter },
    { value: 'manufacturers', label: 'Manufacturers', icon: Factory },
    { value: 'suppliers', label: 'Suppliers', icon: Truck },
    { value: 'products', label: 'Products', icon: Package },
    { value: 'warehouses', label: 'Warehouses', icon: Warehouse },
    { value: 'vehicles', label: 'Vehicles', icon: Bus }
  ]

  const componentMap = {
    dashboard: <InventoryDashboard />,
    categories: <InventoryCategories />,
    manufacturers: <InventoryManufacturer />,
    suppliers: <InventorySuppliers />,
    products: <InventoryProducts />,
    warehouses: <InventoryWarehouses />,
    vehicles: <InventoryVehicles />
  }

  return (
    <SidebarTabsLayout
      title="Inventory"
      titleIcon={LayoutDashboard}
      tabs={tabs}
      defaultTab="dashboard"
      componentMap={componentMap}
    />
  )
}
