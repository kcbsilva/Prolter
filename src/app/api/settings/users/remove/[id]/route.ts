// /app/api/users/remove/[id]/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface Params {
  params: { id: string }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = params

  try {
    // Optional: prevent archiving protected system users
    const { rows } = await db.query(`SELECT system_id FROM user_profiles WHERE id = $1`, [id])
    const user = rows[0]

    if (user?.system_id === '1') {
      return NextResponse.json({ error: 'Cannot archive core system user' }, { status: 403 })
    }

    // Soft-delete (archive) instead of hard delete
    await db.query(`UPDATE user_profiles SET is_archived = true WHERE id = $1`, [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[USERS_ARCHIVE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to archive user' }, { status: 500 })
  }
}
