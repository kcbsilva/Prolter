// src/app/api/settings/postgres/table-details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const dbName = req.nextUrl.searchParams.get('db');
  const table = req.nextUrl.searchParams.get('table');

  if (!dbName || !table) {
    return NextResponse.json({ error: 'Missing db or table param' }, { status: 400 });
  }

  try {
    const result = await db.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1 AND table_catalog = $2 ORDER BY ordinal_position`,
      [table, dbName]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching table columns:', error);
    return NextResponse.json({ error: 'Failed to fetch table details' }, { status: 500 });
  }
}
