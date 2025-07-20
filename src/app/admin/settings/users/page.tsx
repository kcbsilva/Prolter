// /app/admin/settings/user/page.tsx
'use client'

import * as React from 'react'
import { ListUsers } from '@/components/settings/users/ListUsers'
import { UsersCards } from '@/components/settings/users/UsersCards'
import { Button } from '@/components/ui/button'

export default function UserSettingsPage() {
  const [tab, setTab] = React.useState<'active' | 'archived'>('active')

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
      </div>

      <UsersCards />

      <div className="flex gap-2">
        <Button
          variant={tab === 'active' ? 'default' : 'outline'}
          onClick={() => setTab('active')}
        >
          Active Users
        </Button>
        <Button
          variant={tab === 'archived' ? 'default' : 'outline'}
          onClick={() => setTab('archived')}
        >
          Archived Users
        </Button>
      </div>

      <ListUsers tab={tab} />
    </main>
  )
}
