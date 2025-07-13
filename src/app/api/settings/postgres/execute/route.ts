// src/app/api/settings/postgres/execute/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Invalid SQL query.' }, { status: 400 });
    }

    const isSelect = query.trim().toLowerCase().startsWith('select');
    const result = await db.query(query);

    return NextResponse.json(
      isSelect ? result.rows : { message: `Query executed successfully. Rows affected: ${result.rowCount}` }
    );
  } catch (error: any) {
    console.error('SQL execution error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
