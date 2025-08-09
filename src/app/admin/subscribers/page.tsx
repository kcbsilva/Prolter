// src/app/admin/subscribers/page.tsx
'use client'

import * as React from 'react'
import { AddSubscriberModal } from '@/components/subscribers/AddSubscriberModal'
import { ListSubscribers } from '@/components/subscribers/ListSubscribers'
import { SubscribersCards } from '@/components/subscribers/SubscribersCards'
import { ClientBar } from '@/components/subscribers/ClientBar'
import { Subscriber } from '@/types/subscribers'

type Status = 'Active' | 'Suspended' | 'Inactive'

const PER_PAGE = 10
const SEARCH_DEBOUNCE_MS = 300
const MIN_LOADING_MS = 250 // ensures the skeleton is visible briefly

interface ApiResponse {
  subscribers: Subscriber[]
  totalPages: number
  totalCount?: number
}

export default function SubscribersPage() {
  const [loading, setLoading] = React.useState(true)
  const [subscribers, setSubscribers] = React.useState<Subscriber[]>([])
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCount, setTotalCount] = React.useState<number | undefined>(undefined)

  const [page, setPage] = React.useState(1)
  const [statusFilter, setStatusFilter] = React.useState<Status[]>([])
  const [search, setSearch] = React.useState('')

  const [showAddModal, setShowAddModal] = React.useState(false)

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = React.useState(search)
  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [search])

  // Reset page when filters/search change
  React.useEffect(() => {
    setPage(1)
  }, [statusFilter, debouncedSearch])

  const fetchAbortRef = React.useRef<AbortController | null>(null)

  const fetchSubscribers = React.useCallback(async () => {
    // cancel any in-flight request
    fetchAbortRef.current?.abort()
    const controller = new AbortController()
    fetchAbortRef.current = controller

    setLoading(true)
    const startedAt = Date.now()

    try {
      const params = new URLSearchParams({
        page: String(page),
        perPage: String(PER_PAGE),
      })
      statusFilter.forEach((s) => params.append('status', s))
      if (debouncedSearch) params.append('search', debouncedSearch)

      const res = await fetch(`/api/subscribers/list?${params.toString()}`, {
        signal: controller.signal,
        headers: { 'cache-control': 'no-store' },
      })

      if (!res.ok) throw new Error(`Request failed: ${res.status}`)

      const data: ApiResponse = await res.json()
      setSubscribers(data.subscribers ?? [])
      setTotalPages(data.totalPages ?? 1)
      setTotalCount(data.totalCount ?? data.subscribers?.length ?? 0)
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        console.error('Failed to load subscribers:', e)
        setSubscribers([])
        setTotalPages(1)
        setTotalCount(0)
      }
    } finally {
      // enforce a minimum time in "loading" to let the skeleton show
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed)
      const t = setTimeout(() => setLoading(false), remaining)
      return () => clearTimeout(t)
    }
  }, [page, statusFilter, debouncedSearch])

  React.useEffect(() => {
    fetchSubscribers()
    return () => {
      fetchAbortRef.current?.abort()
    }
  }, [fetchSubscribers])

  // Handlers
  const handleAddClick = React.useCallback(() => setShowAddModal(true), [])
  const handleAddClose = React.useCallback(() => setShowAddModal(false), [])
  const handleAddSuccess = React.useCallback(() => {
    fetchSubscribers()
    setShowAddModal(false)
  }, [fetchSubscribers])
  const handlePageChange = React.useCallback((p: number) => setPage(p), [])
  const handleSearchChange = React.useCallback((v: string) => setSearch(v), [])
  const handleStatusChange = React.useCallback((v: Status[]) => setStatusFilter(v), [])

  return (
    <main className="p-6 space-y-8">
      <SubscribersCards
        loading={loading}
        total={totalCount ?? subscribers.length}
      />

      <ClientBar
        total={totalCount ?? subscribers.length}
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        onAdd={handleAddClick}
      />

      <ListSubscribers
        subscribers={subscribers}
        loading={loading}
        refetch={fetchSubscribers}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        perPage={PER_PAGE} // pass per-page so skeleton rows match
      />

      <AddSubscriberModal
        open={showAddModal}
        onClose={handleAddClose}
        onSuccess={handleAddSuccess}
      />
    </main>
  )
}
