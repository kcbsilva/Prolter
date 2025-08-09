// src/app/api/system/update/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const sh = promisify(exec);

export async function POST() {
  try {
    const env = {
      ...process.env,
      PATH: ['/usr/local/bin', '/usr/bin', '/bin', process.env.PATH].filter(Boolean).join(':'),
      GIT_TERMINAL_PROMPT: '0',
      CI: '1',
    };

    const cmd = [
      'set -euo pipefail',
      'echo "== Pulling latest code"',
      'git pull',
      'echo "== Installing deps"',
      'npm ci',
      'echo "== Building"',
      'npm run build',
      'echo "== Restarting service"',
      'sudo systemctl restart prolter',
      'echo "== Done"'
    ].join(' && ');

    const { stdout, stderr } = await sh(`bash -c '${cmd.replace(/'/g, `'\\''`)}'`, {
      env,
      cwd: process.cwd(),
      timeout: 0,
      maxBuffer: 1024 * 1024 * 10,
    });

    return new NextResponse(`${stdout}\n${stderr}`, { status: 200 });
  } catch (e: any) {
    const out = [e?.stdout, e?.stderr].filter(Boolean).join('\n') || String(e?.message ?? 'Unknown error');
    return new NextResponse(out, { status: 500 });
  }
}
