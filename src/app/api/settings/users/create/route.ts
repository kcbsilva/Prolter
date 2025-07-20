// /app/api/users/create/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  try {
    const { full_name, username, password } = await req.json()

    if (!full_name || !username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // 🔐 Default role selection — change 'User' to 'Admin' if needed
    const roleRes = await db.query(
      `SELECT id FROM roles WHERE name = 'User' LIMIT 1`
    )
    const role_id = roleRes.rows[0]?.id
    if (!role_id) {
      return NextResponse.json({ error: 'Default role not found' }, { status: 500 })
    }

    // 🧠 status is defaulted to 'active' by DB
    // 🛠️ system_id assumed to be set via trigger/default

    const result = await db.query(
      `
      INSERT INTO user_profiles (full_name, username, password, role_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, username, role_id, status, system_id, created_at
      `,
      [full_name, username, hashedPassword, role_id]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('[USERS_CREATE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
