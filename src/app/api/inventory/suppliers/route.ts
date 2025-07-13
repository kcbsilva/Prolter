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
      businessName: row.business_name || 'N/A',
      businessNumber: row.business_number || 'N/A',
      address: row.address || 'N/A',
      telephone: row.telephone || 'N/A',
      email: row.email || 'N/A',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error('[SUPPLIERS_GET_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, businessNumber, address, telephone, email } = body;

    const result = await db.query(`
      INSERT INTO inventory_suppliers (business_name, business_number, address, telephone, email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [businessName, businessNumber, address, telephone, email]);

    const supplier = {
      id: result.rows[0].id.toString(),
      businessName: result.rows[0].business_name,
      businessNumber: result.rows[0].business_number,
      address: result.rows[0].address,
      telephone: result.rows[0].telephone,
      email: result.rows[0].email,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
    };

    return NextResponse.json(supplier);
  } catch (error) {
    console.error('[SUPPLIERS_POST_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
  }
}
