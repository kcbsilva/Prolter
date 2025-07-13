// /api/inventory/suppliers/create/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const supplierSchema = z.object({
  businessName: z.string().min(1),
  businessNumber: z.string().min(1),
  address: z.string().min(1),
  telephone: z.string().min(1),
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = supplierSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { businessName, businessNumber, address, telephone, email } = parsed.data;

    const result = await db.query(
      `INSERT INTO inventory_suppliers 
        (business_name, business_number, address, telephone, email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [businessName, businessNumber, address, telephone, email]
    );

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
    console.error('[SUPPLIER_CREATE_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 }
    );
  }
}
