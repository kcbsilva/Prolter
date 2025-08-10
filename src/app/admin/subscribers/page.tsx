// src/app/admin/subscribers/page.tsx
'use client'

import * as React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AddSubscriberModal } from '@/components/subscribers/AddSubscriberModal'
import { ListSubscribers } from '@/components/subscribers/ListSubscribers'
import { SubscribersCards } from '@/components/subscribers/SubscribersCards'
import { ClientBar } from '@/components/subscribers/ClientBar'
import { Subscriber } from '@/types/subscribers'

// Types
type Status = 'Active' | 'Suspended' | 'Inactive'

interface ApiResponse {
  subscribers: Subscriber[]
  totalPages: number
  totalCount?: number
}

interface LoadingState {
  initial: boolean
  refreshing: boolean
}

// Constants
const PAGINATION_CONFIG = {
  PER_PAGE: 10,
  SEARCH_DEBOUNCE_MS: 300,
  MIN_LOADING_MS: 250,
} as const

// Utility functions
const validateApiResponse = (data: unknown): data is ApiResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'subscribers' in data &&
    Array.isArray((data as any).subscribers)
  )
}

const parseStatusFromUrl = (statusParam: string | null): Status[] => {
  if (!statusParam) return []
  return statusParam.split(',').filter((s): s is Status => 
    ['Active', 'Suspended', 'Inactive'].includes(s)
  )
}

// Custom hook for URL state management
const useUrlState = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const updateUrl = React.useCallback((updates: {
    page?: number
    search?: string
    status?: Status[]
  }) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (updates.page !== undefined) {
      params.set('page', String(updates.page))
    }
    if (updates.search !== undefined) {
      if (updates.search.trim()) {
        params.set('search', updates.search.trim())
      } else {
        params.delete('search')
      }
    }
    if (updates.status !== undefined) {
      if (updates.status.length > 0) {
        params.set('status', updates.status.join(','))
      } else {
        params.delete('status')
      }
    }
    
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [searchParams, router])

  return {
    page: parseInt(searchParams.get('page') || '1', 10),
    search: searchParams.get('search') || '',
    statusFilter: parseStatusFromUrl(searchParams.get('status')),
    updateUrl,
  }
}

// Custom hook for subscribers data
const useSubscribersData = (page: number, statusFilter: Status[], debouncedSearch: string) => {
  const [subscribers, setSubscribers] = React.useState<Subscriber[]>([])
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCount, setTotalCount] = React.useState<number | undefined>(undefined)
  const [loading, setLoading] = React.useState<LoadingState>({ initial: true, refreshing: false })
  const [error, setError] = React.useState<string | null>(null)

  const fetchAbortRef = React.useRef<AbortController | null>(null)

  const queryParams = React.useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      perPage: String(PAGINATION_CONFIG.PER_PAGE),
    })
    statusFilter.forEach((s) => params.append('status', s))
    if (debouncedSearch) params.append('search', debouncedSearch)
    return params.toString()
  }, [page, statusFilter, debouncedSearch])

  const fetchSubscribers = React.useCallback(async (isRefresh = false) => {
    // Cancel any in-flight request
    fetchAbortRef.current?.abort()
    const controller = new AbortController()
    fetchAbortRef.current = controller

    setLoading(prev => ({ 
      initial: prev.initial && !isRefresh, 
      refreshing: isRefresh 
    }))
    setError(null)
    const startedAt = Date.now()

    try {
      const res = await fetch(`/api/subscribers/list?${queryParams}`, {
        signal: controller.signal,
        headers: { 'cache-control': 'no-store' },
      })

      if (!res.ok) {
        throw new Error(`Failed to load subscribers (${res.status})`)
      }

      const data: unknown = await res.json()
      
      if (!validateApiResponse(data)) {
        throw new Error('Invalid response format')
      }

      setSubscribers(data.subscribers)
      setTotalPages(Math.max(1, data.totalPages))
      setTotalCount(
        typeof data.totalCount === 'number'
          ? data.totalCount
          : data.subscribers.length
      )
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        console.error('Failed to load subscribers:', e)
        const errorMessage = e.message || 'Failed to load subscribers'
        setError(errorMessage)
        setSubscribers([])
        setTotalPages(1)
        setTotalCount(0)
      }
    } finally {
      // Enforce minimum loading time for better UX
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, PAGINATION_CONFIG.MIN_LOADING_MS - elapsed)
      
      if (remaining > 0) {
        await new Promise((r) => setTimeout(r, remaining))
      }
      
      // Only stop loading if this request wasn't aborted
      if (!controller.signal.aborted) {
        setLoading({ initial: false, refreshing: false })
      }
    }
  }, [queryParams])

  const addOptimisticSubscriber = React.useCallback((newSubscriber: Subscriber) => {
    // Add optimistically to current page if we're on page 1
    if (page === 1) {
      setSubscribers(prev => [newSubscriber, ...prev.slice(0, PAGINATION_CONFIG.PER_PAGE - 1)])
    }
    setTotalCount(prev => (prev ?? 0) + 1)
  }, [page])

  // Fetch data when dependencies change
  React.useEffect(() => {
    fetchSubscribers()
    return () => {
      fetchAbortRef.current?.abort()
    }
  }, [fetchSubscribers])

  const refetch = React.useCallback(() => fetchSubscribers(true), [fetchSubscribers])

  return {
    subscribers,
    totalPages,
    totalCount,
    loading,
    error,
    refetch,
    addOptimisticSubscriber,
  }
}

export default function SubscribersPage() {
  const { page, search, statusFilter, updateUrl } = useUrlState()
  
  // Local search state for immediate UI updates
  const [localSearch, setLocalSearch] = React.useState(search)
  
  // Debounced search that syncs with URL
  const [debouncedSearch, setDebouncedSearch] = React.useState(search)
  React.useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(localSearch.trim())
      updateUrl({ search: localSearch.trim() })
    }, PAGINATION_CONFIG.SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [localSearch, updateUrl])

  const {
    subscribers,
    totalPages,
    totalCount,
    loading,
    error,
    refetch,
    addOptimisticSubscriber,
  } = useSubscribersData(page, statusFilter, debouncedSearch)

  const [showAddModal, setShowAddModal] = React.useState(false)

  // Reset page when filters/search change (but not on initial load)
  const isInitialLoad = React.useRef(true)
  React.useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      return
    }
    if (page !== 1) {
      updateUrl({ page: 1 })
    }
  }, [statusFilter, debouncedSearch, page, updateUrl])

  // Handlers
  const handleAddClick = React.useCallback(() => setShowAddModal(true), [])
  const handleAddClose = React.useCallback(() => setShowAddModal(false), [])
  
  const handleAddSuccess = React.useCallback((newSubscriber?: Subscriber) => {
    if (newSubscriber) {
      addOptimisticSubscriber(newSubscriber)
    }
    refetch() // Still refetch for accuracy
    setShowAddModal(false)
  }, [addOptimisticSubscriber, refetch])

  const handlePageChange = React.useCallback((newPage: number) => {
    updateUrl({ page: newPage })
  }, [updateUrl])

  const handleSearchChange = React.useCallback((value: string) => {
    setLocalSearch(value)
  }, [])

  const handleStatusChange = React.useCallback((value: Status[]) => {
    updateUrl({ status: value })
  }, [updateUrl])

  const handleRetry = React.useCallback(() => {
    refetch()
  }, [refetch])

  const effectiveTotal = totalCount ?? subscribers.length
  const isLoading = loading.initial || loading.refreshing

  // Simple error display component
  const ErrorDisplay = error ? (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-red-400 mr-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-red-700">{error}</p>
        </div>
        <button
          onClick={handleRetry}
          className="text-red-600 hover:text-red-800 font-medium text-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  ) : null

  return (
    <main className="p-6 space-y-8">
      <SubscribersCards loading={loading.initial} total={effectiveTotal} />

      {ErrorDisplay}

      <ClientBar
        total={effectiveTotal}
        search={localSearch}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        onAdd={handleAddClick}
      />

      <ListSubscribers
        subscribers={subscribers}
        loading={loading.initial}
        refetch={refetch}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        perPage={PAGINATION_CONFIG.PER_PAGE}
      />

      <AddSubscriberModal
        open={showAddModal}
        onClose={handleAddClose}
        onSuccess={handleAddSuccess}
      />
    </main>
  )
}