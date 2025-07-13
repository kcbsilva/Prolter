// src/app/api/inventory/manufacturers/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query(`
      SELECT id, business_name, business_number, address, telephone, email, created_at
      FROM inventory_manufacturers
      ORDER BY created_at DESC
    `);

    const manufacturers = result.rows.map((row) => ({
      id: row.id,
      businessName: row.business_name,
      businessNumber: row.business_number,
      address: row.address,
      telephone: row.telephone,
      email: row.email,
      createdAt: row.created_at,
    }));

    return NextResponse.json(manufacturers);
  } catch (error) {
    console.error('[GET_MANUFACTURERS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch manufacturers' }, { status: 500 });
  }
}
