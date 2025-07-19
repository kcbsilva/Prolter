// src/app/api/settings/users/route.ts
import { createUser, getUserProfiles } from '@/services/postgres/users';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const newUserSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(6),
  fullName: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = newUserSchema.safeParse(body);

    if (!parsed.success) {
      console.error('Validation error:', parsed.error.format());
      return new Response('Invalid user data', { status: 400 });
    }

    const user = await createUser({
      username: parsed.data.username,
      password: parsed.data.password,
      full_name: parsed.data.fullName,
      role: 'admin', // ⬅️ hardcoded here
    });

    return Response.json(user);
  } catch (err) {
    console.error('POST /settings/users failed:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const users = await getUserProfiles();
    return Response.json(users);
  } catch (err) {
    console.error('GET /settings/users failed:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
