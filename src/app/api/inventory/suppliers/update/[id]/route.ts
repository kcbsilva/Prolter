// /api/inventory/suppliers/update/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

interface Params {
  params: { id: string };
}

const idSchema = z.string().uuid(); // Use `z.coerce.number()` if IDs are numeric

const updateSupplierSchema = z.object({
  businessName: z.string().min(1),
  businessNumber: z.string().min(1),
  address: z.string().min(1),
  telephone: z.string().min(1),
  email: z.string().email(),
});

export async function PUT(req: Request, { params }: Params) {
  const { id } = params;

  const idParsed = idSchema.safeParse(id);
  if (!idParsed.success) {
    return NextResponse.json({ error: 'Invalid supplier ID' }, { status: 400 });
  }

  const body = await req.json();
  const dataParsed = updateSupplierSchema.safeParse(body);

  if (!dataParsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: dataParsed.error.flatten() },
      { status: 400 }
    );
  }

  const { businessName, businessNumber, address, telephone, email } = dataParsed.data;

  try {
    const result = await db.query(
      `
      UPDATE inventory_suppliers
      SET
        business_name = $1,
        business_number = $2,
        address = $3,
        telephone = $4,
        email = $5
      WHERE id = $6
      RETURNING *
      `,
      [businessName, businessNumber, address, telephone, email, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    const updated = result.rows[0];

    return NextResponse.json({
      id: updated.id.toString(),
      businessName: updated.business_name,
      businessNumber: updated.business_number,
      address: updated.address,
      telephone: updated.telephone,
      email: updated.email,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    });
  } catch (error) {
    console.error('[SUPPLIER_UPDATE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 });
  }
}
