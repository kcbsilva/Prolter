// src/app/api/client/send-otp/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { taxNumber } = await req.json();

  const client = await db.query(
    'SELECT id, email, phone FROM client_users WHERE tax_number = $1',
    [taxNumber]
  );

  if (client.rowCount === 0) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  await db.query(
    'INSERT INTO client_otp (client_id, otp_code, expires_at) VALUES ($1, $2, $3)',
    [client.rows[0].id, otp, expiresAt]
  );

  // Send OTP via email (use your email service)
  console.log(`Email OTP to ${client.rows[0].email}: ${otp}`);

  // Send OTP via SMS (use your SMS provider)
  console.log(`SMS OTP to ${client.rows[0].phone}: ${otp}`);

  return NextResponse.json({ success: true });
}
