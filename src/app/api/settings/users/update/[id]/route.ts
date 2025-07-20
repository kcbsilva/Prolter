// /app/api/users/update/[id]/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface Params {
  params: { id: string }
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = params

  try {
    const {
      full_name,
      username,
      role_id,
      status,
      is_archived,
    } = await req.json()

    if (!full_name || !username || !role_id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { rows } = await db.query(
      `
      UPDATE user_profiles
      SET
        full_name = $1,
        username = $2,
        role_id = $3,
        status = $4,
        is_archived = $5
      WHERE id = $6
      RETURNING id, full_name, username, role_id, status, is_archived, system_id, created_at
      `,
      [
        full_name,
        username,
        role_id,
        status,
        is_archived ?? false,
        id
      ]
    )

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('[USERS_UPDATE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
