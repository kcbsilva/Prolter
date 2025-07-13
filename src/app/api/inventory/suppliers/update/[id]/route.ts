// /api/inventory/suppliers/update/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Params {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = params;

  try {
    const {
      businessName,
      businessNumber,
      address,
      telephone,
      email,
    } = await req.json();

    if (!businessName || !businessNumber || !address || !telephone || !email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await db.query(
      `
      UPDATE inventory_suppliers
      SET
        business_name = $1,
        business_number = $2,
        address = $3,
        telephone = $4,
        email = $5
      WHERE id = $6
      `,
      [businessName, businessNumber, address, telephone, email, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SUPPLIER_UPDATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 });
  }
}
