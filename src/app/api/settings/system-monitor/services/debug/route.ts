// src/app/api/debug/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function POST() {
  try {
    const stopService = 'sudo systemctl stop prolter';
    const runDev = 'npm run dev';

    // Stop systemd service
    await execAsync(stopService);

    // Start dev mode
    const { stdout, stderr } = await execAsync(runDev);

    return NextResponse.json({
      message: 'Prolter stopped and dev server started',
      output: stdout,
      error: stderr,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
