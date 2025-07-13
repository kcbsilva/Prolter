// src/app/api/system/update/step/git/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function POST() {
  try {
    const { stdout } = await execAsync('cd /opt/Prolter && git pull', { encoding: 'utf-8' });
    return NextResponse.json({ success: true, output: stdout });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
