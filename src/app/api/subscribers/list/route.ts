// src/app/api/subscribers/list/route.ts
import { NextResponse } from 'next/server'
import { listSubscribers } from '@/services/postgres/subscribers'

// Define valid status values for type safety
const VALID_STATUSES = ['Active', 'Suspended', 'Inactive', 'Planned', 'Canceled'] as const
const VALID_SUBSCRIBER_TYPES = ['Residential', 'Commercial'] as const

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Parse and validate pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('perPage') || '10')))
    
    // Parse and validate status filter
    const statusParam = searchParams.get('status')
    const status = statusParam && VALID_STATUSES.includes(statusParam as any) 
      ? statusParam 
      : undefined
    
    // Parse search query
    const search = searchParams.get('search')?.trim() || undefined
    
    // Parse and validate subscriber type filter
    const subscriberTypeParam = searchParams.get('subscriberType')
    const subscriberType = subscriberTypeParam && VALID_SUBSCRIBER_TYPES.includes(subscriberTypeParam as any)
      ? subscriberTypeParam
      : undefined

    // Parse sort parameters
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'

    console.log('[SUBSCRIBERS_LIST_REQUEST]', {
      page,
      perPage,
      status,
      search,
      subscriberType,
      sortBy,
      sortOrder
    })

    // Use the enhanced listSubscribers function
    const result = await listSubscribers({
      page,
      perPage,
      status,
      search,
      subscriberType,
      sortBy,
      sortOrder
    })

    const response = {
      ...result,
      page,
      perPage,
      filters: {
        status,
        search,
        subscriberType,
        sortBy,
        sortOrder
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[SUBSCRIBERS_LIST_ERROR]', error)
    
    const isDevelopment = process.env.NODE_ENV === 'development'
    const errorMessage = isDevelopment && error instanceof Error 
      ? error.message 
      : 'Failed to fetch subscribers'
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    )
  }
}