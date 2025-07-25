// /app/admin/settings/user/page.tsx
'use client'

import * as React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ListUsers } from '@/components/settings/users/ListUsers'
import { UsersCards } from '@/components/settings/users/UsersCards'

export default function SystemUsers() {
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
      </div>

      <UsersCards />

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Users</TabsTrigger>
          <TabsTrigger value="archived">Archived Users</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <ListUsers tab="active" />
        </TabsContent>
        <TabsContent value="archived">
          <ListUsers tab="archived" />
        </TabsContent>
      </Tabs>
    </main>
  )
}
