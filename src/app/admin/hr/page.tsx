// src/app/hr/page.tsx
'use client'

import dynamic from 'next/dynamic'
import { LayoutDashboard, Users, Clock, Briefcase } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { SidebarTabsLayout } from '@/components/layout/SidebarTabsLayout'

const HRDashboard = dynamic(() => import('@/components/pages/hr/HRDashboard').then(m => m.default))
const HREmployees = dynamic(() => import('@/components/pages/hr/employees/HREmployees').then(m => m.default))
const HRTimeSheets = dynamic(() => import('@/components/pages/hr/timesheets/HRTimeSheets').then(m => m.default))

export default function HRPage() {
  const tabs = [
    { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { value: 'employees', label: 'Employees', icon: Users },
    { value: 'timesheets', label: 'Time Sheets', icon: Clock }
  ] as { value: string; label: string; icon: LucideIcon }[]

  const componentMap = {
    dashboard: <HRDashboard />,
    employees: <HREmployees />,
    timesheets: <HRTimeSheets />
  }

  return (
    <SidebarTabsLayout
      title="Human Resources"
      titleIcon={Briefcase}
      tabs={tabs}
      defaultTab="dashboard"
      componentMap={componentMap}
    />
  )
}
