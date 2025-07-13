// ✅ BACKEND: src/app/api/system/update/step/[step]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function POST(_: NextRequest, { params }: { params: { step: string } }) {
  try {
    let output = '';
    switch (params.step) {
      case 'git':
        output = execSync('cd /opt/Prolter && git pull', { encoding: 'utf-8' });
        break;
      case 'build':
        output = execSync('cd /opt/Prolter && npm install && npm run build', { encoding: 'utf-8' });
        break;
      case 'restart':
        execSync('cd /opt/Prolter && sudo systemctl restart prolter');
        output = 'Restarting in background';
        break;
      default:
        return NextResponse.json({ error: 'Invalid step' }, { status: 400 });
    }
    return NextResponse.json({ success: true, output });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
