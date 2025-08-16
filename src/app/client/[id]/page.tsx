// src/app/client/page.tsx
'use client'

import dynamic from 'next/dynamic'
import { FileText, CreditCard, Wifi, User } from 'lucide-react'
import { VscHome } from "react-icons/vsc";
import { LuMessageSquareMore } from "react-icons/lu";
import type { LucideIcon } from 'lucide-react'

import { SidebarTabsLayout } from '@/components/layout/SidebarTabsLayout'

// Dynamic imports for portal pages
const ClientHome = dynamic(() => import('@/components/client/pages/ClientHome'))
const ClientContracts = dynamic(() => import('@/components/client/pages/ClientContracts'))
const ClientBilling = dynamic(() => import('@/components/client/pages/ClientBilling'))
const ClientServices = dynamic(() => import('@/components/client/pages/ClientServices'))
const ClientTickets = dynamic(() => import('@/components/client/pages/ClientTickets'))
const ClientProfile = dynamic(() => import('@/components/client/pages/ClientProfile'))

export default function ClientPortalPage() {
  const tabs = [
    { value: 'home', label: 'Home', icon: VscHome },
    { value: 'contracts', label: 'Contracts', icon: FileText },
    { value: 'billing', label: 'Billing', icon: CreditCard },
    { value: 'services', label: 'Services', icon: Wifi },
    { value: 'tickets', label: 'Tickets', icon: LuMessageSquareMore },
    { value: 'profile', label: 'Profile', icon: User },
  ] as { value: string; label: string; icon: LucideIcon }[]

  const componentMap = {
    home: <ClientHome />,
    contracts: <ClientContracts />,
    billing: <ClientBilling />,
    services: <ClientServices />,
    tickets: <ClientTickets />,
    profile: <ClientProfile />,
  }

  return (
    <SidebarTabsLayout
      title="Client Portal"
      titleIcon={User}
      tabs={tabs}
      defaultTab="home"
      componentMap={componentMap}
    />
  )
}
