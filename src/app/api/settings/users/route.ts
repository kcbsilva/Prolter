// src/app/api/settings/users/route.ts
import { createUser } from '@/services/postgres/users';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const newUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  role: z.enum(['admin', 'user']),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = newUserSchema.safeParse(body);

    if (!parsed.success) {
      console.error('Validation error:', parsed.error.format());
      return new Response('Invalid user data', { status: 400 });
    }

    const user = await createUser(parsed.data);
    return Response.json(user);
  } catch (err) {
    console.error('POST /admin/settings/users failed:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
