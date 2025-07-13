// src/app/api/debug/status/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function GET() {
  try {
    // Check if 'npm run dev' is running
    const { stdout } = await execAsync(`ps aux | grep 'npm run dev' | grep -v grep`);

    const isDebug = stdout.trim().length > 0;

    return NextResponse.json({ debug: isDebug });
  } catch {
    return NextResponse.json({ debug: false });
  }
}
