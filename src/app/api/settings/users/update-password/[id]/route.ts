// /app/api/users/update-password/[id]/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { z } from 'zod'

interface Params {
  params: { id: string }
}

// Common weak passwords (can be extended)
const commonPasswords = [
  '123456', 'password', 'qwerty', '12345678', 'admin', 'letmein', 'iloveyou',
]

const schema = z.object({
  newPassword: z.string().min(8, 'Password too short'),
})

export async function PUT(req: Request, { params }: Params) {
  const { id } = params
  const body = await req.json()
  const parse = schema.safeParse(body)

  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid password format' }, { status: 400 })
  }

  const newPassword = body.newPassword as string

  // Reject if weak or common password
  const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
  if (!strongPattern.test(newPassword)) {
    return NextResponse.json({ error: 'Password must include upper, lower, number, and symbol' }, { status: 400 })
  }
  if (commonPasswords.includes(newPassword.toLowerCase())) {
    return NextResponse.json({ error: 'Password is too common' }, { status: 400 })
  }

  try {
    // Get password history
    const { rows } = await db.query(`
      SELECT password FROM user_password_history 
      WHERE user_id = $1 
      ORDER BY changed_at DESC 
      LIMIT 3
    `, [id])

    // Check against last 3
    for (const entry of rows) {
      const isReuse = await bcrypt.compare(newPassword, entry.password)
      if (isReuse) {
        return NextResponse.json({ error: 'You cannot reuse the last 3 passwords' }, { status: 400 })
      }
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10)

    // Update in user_profiles
    await db.query(`UPDATE user_profiles SET password = $1 WHERE id = $2`, [hashed, id])

    // Insert into history table
    await db.query(`
      INSERT INTO user_password_history (user_id, password, changed_at) 
      VALUES ($1, $2, NOW())
    `, [id, hashed])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[UPDATE_PASSWORD_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
