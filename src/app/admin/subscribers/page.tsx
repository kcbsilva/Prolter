// src/app/admin/subscribers/page.tsx
'use client'

import * as React from 'react'
import { AddSubscriberModal } from '@/components/subscribers/AddSubscriberModal'
import { ListSubscribers } from '@/components/subscribers/ListSubscribers'
import { SubscribersCards } from '@/components/subscribers/SubscribersCards'
import { ClientBar } from '@/components/subscribers/ClientBar'
import { Subscriber } from '@/types/subscribers'

export default function SubscribersPage() {
  const [loading, setLoading] = React.useState(true)
  const [subscribers, setSubscribers] = React.useState<Subscriber[]>([])
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)

  const [statusFilter, setStatusFilter] = React.useState<('Active' | 'Suspended' | 'Inactive')[]>([])
  const [search, setSearch] = React.useState('')
  const [showAddModal, setShowAddModal] = React.useState(false) // ✅ add this

  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: '10',
      })
      statusFilter.forEach((status) => params.append('status', status))
      if (search) params.append('search', search)

      const res = await fetch(`/api/subscribers/list?${params.toString()}`)
      const data = await res.json()
      setSubscribers(data.subscribers || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to load subscribers:', error)
      setSubscribers([])
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchSubscribers()
  }, [page, statusFilter, search])

  return (
    <main className="p-6 space-y-8">
      <SubscribersCards loading={loading} total={subscribers.length} />

      <ClientBar
        total={subscribers.length}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onAdd={() => setShowAddModal(true)} // ✅ trigger modal open
      />

      <ListSubscribers
        subscribers={subscribers}
        loading={loading}
        refetch={fetchSubscribers}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <AddSubscriberModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          fetchSubscribers()
          setShowAddModal(false)
        }}
      />
    </main>
  )
}
