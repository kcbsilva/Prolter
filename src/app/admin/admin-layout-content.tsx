// src/app/admin/admin-layout-content.tsx
'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { HeaderNav } from '@/components/layout/HeaderNav'

export function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMapPage = pathname === '/admin/maps/map'

  return (
    <div className="p-0 flex flex-col h-screen w-full overflow-hidden">
      {/* Double Header */}
      <HeaderNav />
    

      {/* Main content area */}
      <main
        className={isMapPage
          ? 'flex-1 p-1 h-full overflow-y-auto'
          : 'flex-1 p-4 md:p-4 lg:p-6 h-full overflow-y-auto'}
      >
        {children}
      </main>
    </div>
  )
}
