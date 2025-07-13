// src/app/api/debug/toggle/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function POST() {
  try {
    // Check if dev is running
    const { stdout } = await execAsync(`ps aux | grep 'npm run dev' | grep -v grep`);
    const isDebugRunning = stdout.trim().length > 0;

    if (isDebugRunning) {
      // Kill all npm run dev
      await execAsync(`pkill -f 'npm run dev'`);
      await execAsync(`sudo systemctl start prolter`);
      return NextResponse.json({ status: 'stopped' });
    } else {
      await execAsync(`sudo systemctl stop prolter`);
      await execAsync(`npm run dev &`);
      return NextResponse.json({ status: 'started' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
