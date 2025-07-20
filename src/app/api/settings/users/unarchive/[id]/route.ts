import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await db.query(
      `UPDATE user_profiles SET is_archived = false WHERE id = $1`,
      [id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[UNARCHIVE_USER_ERROR]', error)
    return NextResponse.json({ error: 'Failed to unarchive user' }, { status: 500 })
  }
}
