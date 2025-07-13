// /api/inventory/suppliers/remove/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

interface Params {
  params: { id: string };
}

// Use number validation instead of UUID
const idSchema = z.coerce.number().int().positive();

export async function DELETE(req: Request, { params }: Params) {
  const parsed = idSchema.safeParse(params.id);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid supplier ID' },
      { status: 400 }
    );
  }

  const id = parsed.data;

  try {
    const result = await db.query(
      `DELETE FROM inventory_suppliers WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SUPPLIER_DELETE_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to delete supplier' },
      { status: 500 }
    );
  }
}
