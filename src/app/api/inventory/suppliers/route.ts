// /api/inventory/suppliers/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query(`
      SELECT 
        id,
        business_name,
        business_number,
        address,
        telephone,
        email,
        created_at,
        updated_at
      FROM inventory_suppliers
      ORDER BY created_at DESC
    `);

    const suppliers = result.rows.map(row => ({
      id: row.id.toString(),
      businessName: row.business_name,
      businessNumber: row.business_number,
      address: row.address,
      telephone: row.telephone,
      email: row.email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error('[SUPPLIERS_GET_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}
