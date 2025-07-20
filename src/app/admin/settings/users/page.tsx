// /app/admin/settings/user/page.tsx
'use client'

import { ListUsers } from '@/components/settings/users/ListUsers'
import { UsersCards } from '@/components/settings/users/UsersCards'

export default function UserSettingsPage() {
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
      </div>
      <UsersCards />
      <ListUsers />
    </main>
  )
}
