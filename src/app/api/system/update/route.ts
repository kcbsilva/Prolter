// src/app/api/system/update/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
const sh = promisify(exec);

async function run(cmd: string, opts: any) {
  const { stdout, stderr } = await sh(cmd, opts);
  return `${stdout?.toString?.() || ''}${stderr?.toString?.() || ''}`;
}

export async function POST() {
  const opts = {
    env: {
      ...process.env,
      PATH: ['/usr/local/bin', '/usr/bin', '/bin', process.env.PATH].filter(Boolean).join(':'),
      HOME: '/home/prolteradmin',
      NPM_CONFIG_CACHE: '/opt/Prolter/.npm-cache',
      GIT_TERMINAL_PROMPT: '0',
      CI: '1',
    },
    cwd: '/opt/Prolter',
    timeout: 0,
    maxBuffer: 1024 * 1024 * 20,
  };

  try {
    let output = '== Pulling latest code\n';
    const pullOut = await run('bash -c "git pull"', opts);
    output += pullOut + '\n';

    const alreadyUpToDate = /Already\s+up(?:-|\s)to(?:-|\s)date\.?/i.test(pullOut);
    if (alreadyUpToDate) {
      output += '== No changes detected\nSystem is already up to date\n';
      return new NextResponse(output, { status: 200 });
    }

    output += '== Installing deps\n';
    output += await run('bash -c "npm ci"', opts); // cache comes from env

    output += '\n== Building\n';
    output += await run('bash -c "npm run build"', opts);

    output += '\n== Restarting service\n';
    output += await run('bash -c "sudo systemctl restart prolter"', opts);

    output += '\n== Done\n';
    return new NextResponse(output, { status: 200 });
  } catch (e: any) {
    const out = [e?.stdout?.toString?.(), e?.stderr?.toString?.(), e?.message].filter(Boolean).join('\n');
    return new NextResponse(out || 'Unknown error', { status: 500 });
  }
}
