// /app/api/users/archived/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const { rows } = await db.query(`
      SELECT
        id,
        full_name,
        username,
        role_id,
        status,
        system_id,
        is_archived,
        created_at
      FROM user_profiles
      WHERE is_archived = true
      ORDER BY created_at DESC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error('[GET_ARCHIVED_USERS_ERROR]', error)
    return NextResponse.json({ error: 'Failed to fetch archived users' }, { status: 500 })
  }
}
