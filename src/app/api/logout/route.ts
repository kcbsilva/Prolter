import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });

  res.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    expires: new Date(0), // Delete cookie
  });

  return res;
}
