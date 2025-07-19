// src/app/api/users/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, full_name, role_id } = body;

    if (!username || !full_name || !role_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const insertResult = await query(
      `INSERT INTO users (username, full_name, role_id)
       VALUES ($1, $2, $3)
       RETURNING id, username, full_name, role_id`,
      [username, full_name, role_id]
    );

    return NextResponse.json(insertResult.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('[USER_CREATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
