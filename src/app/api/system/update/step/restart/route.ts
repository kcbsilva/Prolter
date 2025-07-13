// src/app/api/system/update/step/restart/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function POST() {
  try {
    await execAsync('cd /opt/Prolter && sudo systemctl restart prolter');
    return NextResponse.json({ success: true, output: 'Prolter restarting in background' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
