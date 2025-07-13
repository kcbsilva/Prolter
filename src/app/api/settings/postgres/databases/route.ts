// src/app/api/settings/postgres/databases/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query(`
      SELECT 
        datname AS name,
        pg_catalog.pg_get_userbyid(datdba) AS owner,
        pg_encoding_to_char(encoding) AS encoding,
        pg_size_pretty(pg_database_size(datname)) AS size
      FROM pg_database
      WHERE datistemplate = false
      ORDER BY datname;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[GET_DATABASES_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
