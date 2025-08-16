// src/app/api/client/verify-otp/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  const { taxNumber, otp } = await req.json();

  const client = await db.query(
    'SELECT id FROM client_users WHERE tax_number = $1',
    [taxNumber]
  );

  if (client.rowCount === 0) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  const match = await db.query(
    'SELECT * FROM client_otp WHERE client_id = $1 AND otp_code = $2 AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
    [client.rows[0].id, otp]
  );

  if (match.rowCount === 0) {
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
  }

  // Delete OTP after use
  await db.query('DELETE FROM client_otp WHERE id = $1', [match.rows[0].id]);

  const token = jwt.sign(
    { id: client.rows[0].id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  const res = NextResponse.json({ success: true, id: client.rows[0].id });
  res.cookies.set('client_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
