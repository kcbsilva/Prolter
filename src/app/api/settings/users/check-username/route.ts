// /app/api/users/check-username/route.ts
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ available: false })
  }

  const result = await db.query(
    `SELECT 1 FROM user_profiles WHERE username = $1 LIMIT 1`,
    [username]
  )

  return NextResponse.json({ available: result.rowCount === 0 })
}
