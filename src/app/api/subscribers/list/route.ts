// src/app/api/subscribers/list/route.ts
import { NextResponse } from 'next/server'
import { listSubscribers } from '@/services/postgres/subscribers'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('perPage') || '10')
    const status = searchParams.get('status') || undefined // ✅ fix here

    const { subscribers, total, totalPages } = await listSubscribers(page, perPage, status)

    return NextResponse.json({ subscribers, total, totalPages, page, perPage })
  } catch (error) {
    console.error('[SUBSCRIBERS_LIST_ERROR]', error)
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}
