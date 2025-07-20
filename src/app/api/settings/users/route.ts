// /app/api/users/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const isArchived = searchParams.get('archived') === 'true'

    const { rows } = await db.query(`
      SELECT 
        ROW_NUMBER() OVER (ORDER BY created_at DESC) AS system_id,
        id, full_name, username, role_id, status, is_archived, created_at
      FROM user_profiles
      WHERE is_archived = $1
    `, [isArchived])

    return NextResponse.json(rows)
  } catch (error) {
    console.error('[USERS_GET_ERROR]', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
