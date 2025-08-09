// src/app/api/system/update/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const sh = promisify(exec);

// Optional: tighten who can call this (cookie/session/JWT/IP check) before running.
// export async function middleware() { ... }

export async function POST() {
  try {
    // ensure PATH has npm/systemctl for non-login shells
    const env = {
      ...process.env,
      PATH: ['/usr/local/bin', '/usr/bin', '/bin', process.env.PATH].filter(Boolean).join(':'),
      // If you need non-interactive git pulls:
      GIT_TERMINAL_PROMPT: '0',
    };

    const cmd = [
      'set -euo pipefail',
      'echo "== Stopping service"',
      'sudo systemctl stop prolter',
      'echo "== Pulling latest code"',
      'git pull',
      'echo "== Installing deps (npm ci)"',
      'npm ci',
      'echo "== Building"',
      'npm run build',
      'echo "== Starting service"',
      'sudo systemctl start prolter',
      'echo "== Done"',
    ].join(' && ');

    const { stdout, stderr } = await sh(`bash -lc '${cmd.replace(/'/g, `'\\''`)}'`, { env, cwd: process.cwd(), timeout: 0, maxBuffer: 1024 * 1024 * 10 });
    return new NextResponse(`${stdout}\n${stderr}`, { status: 200 });
  } catch (e: any) {
    const out = [e?.stdout, e?.stderr].filter(Boolean).join('\n');
    return new NextResponse(out || String(e?.message ?? 'Unknown error'), { status: 500 });
  }
}
