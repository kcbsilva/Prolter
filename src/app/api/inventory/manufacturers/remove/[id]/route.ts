// src/app/api/inventory/manufacturers/remove/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Params {
  params: { id: string };
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const id = params.id;

    const result = await db.query(
      `DELETE FROM inventory_manufacturers WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Manufacturer not found' }, { status: 404 });
    }

    const row = result.rows[0];

    return NextResponse.json({
      id: row.id,
      businessName: row.business_name,
      businessNumber: row.business_number,
      address: row.address,
      telephone: row.telephone,
      email: row.email,
      createdAt: row.created_at,
    });
  } catch (error) {
    console.error('[DELETE_MANUFACTURER_ERROR]', error);
    return NextResponse.json({ error: 'Failed to delete manufacturer' }, { status: 500 });
  }
}
