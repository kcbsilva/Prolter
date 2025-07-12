// /src/app/api/system/update/step/[step]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'child_process'

export async function POST(_: NextRequest, { params }: { params: { step: string } }) {
  try {
    let output = ''
    switch (params.step) {
      case 'stop':
        output = execSync('sudo systemctl stop prolter').toString()
        break
      case 'git':
        output = execSync('cd /opt/Prolter && sudo git pull').toString()
        break
      case 'build':
        output = execSync('cd /opt/Prolter && npm install && npm run build').toString()
        break
      case 'start':
        output = execSync('sudo systemctl start prolter').toString()
        break
      default:
        return NextResponse.json({ error: 'Invalid step' }, { status: 400 })
    }

    return NextResponse.json({ success: true, output })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
