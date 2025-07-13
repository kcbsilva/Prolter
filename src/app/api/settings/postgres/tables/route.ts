// src/app/api/settings/postgres/tables/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const dbName = req.nextUrl.searchParams.get('db');

  if (!dbName) {
    return NextResponse.json({ error: 'Missing db query param' }, { status: 400 });
  }

  try {
    const result = await db.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_catalog = $1 ORDER BY table_name`,
      [dbName]
    );

    const tables = result.rows.map((row) => row.table_name);
    return NextResponse.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
}
