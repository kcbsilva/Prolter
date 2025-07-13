// /api/inventory/suppliers/create/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const {
      businessName,
      businessNumber,
      address,
      telephone,
      email,
    } = await req.json();

    // Basic field validation (you can expand this if needed)
    if (!businessName || !businessNumber || !address || !telephone || !email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await db.query(
      `INSERT INTO inventory_suppliers 
        (business_name, business_number, address, telephone, email)
       VALUES ($1, $2, $3, $4, $5)`,
      [businessName, businessNumber, address, telephone, email]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SUPPLIER_CREATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
  }
}
