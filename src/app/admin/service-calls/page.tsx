// src/app/service-calls/page.tsx
'use client'

import * as React from 'react'
import { LayoutDashboard, ListChecks, Wrench } from 'lucide-react'
import { SidebarTabsLayout } from '@/components/layout/SidebarTabsLayout'

import { ServiceCallsDashboard } from '@/components/pages/service-calls/ServiceCallsDashboard'
import { ServiceCallsTypes } from '@/components/pages/service-calls/ServiceCallsTypes'

const tabs = [
  { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { value: 'types', label: 'Service Types', icon: ListChecks },
]

export default function ServiceCallsPage() {
  return (
    <SidebarTabsLayout
      title="Service Calls"
      titleIcon={Wrench}
      tabs={tabs}
      defaultTab="dashboard"
      componentMap={{
        dashboard: <ServiceCallsDashboard />,
        types: <ServiceCallsTypes />,
      }}
    />
  )
}
