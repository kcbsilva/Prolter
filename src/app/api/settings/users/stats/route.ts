import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const totalRes = await db.query(`SELECT COUNT(*) FROM user_profiles`)
  const activeRes = await db.query(`SELECT COUNT(*) FROM user_profiles WHERE status = 'active'`)
  const inactiveRes = await db.query(`SELECT COUNT(*) FROM user_profiles WHERE status = 'inactive'`)
  const adminRes = await db.query(`
    SELECT COUNT(*) 
    FROM user_profiles 
    WHERE role_id = (SELECT id FROM roles WHERE name = 'admin' LIMIT 1)
  `)

  return NextResponse.json({
    total: parseInt(totalRes.rows[0].count, 10),
    active: parseInt(activeRes.rows[0].count, 10),
    inactive: parseInt(inactiveRes.rows[0].count, 10),
    admins: parseInt(adminRes.rows[0].count, 10)
  })
}
