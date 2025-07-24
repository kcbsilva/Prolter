// src/app/api/save-env/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

export async function POST(req: NextRequest) {
  try {
    const { key, value } = await req.json()

    if (!key || !value) {
      return NextResponse.json({ error: 'Missing key or value' }, { status: 400 })
    }

    const envPath = path.resolve(process.cwd(), '.env')
    let envContent = ''
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
    }

    const lines = envContent.split('\n').filter(line => !line.startsWith(`${key}=`))
    lines.push(`${key}="${value}"`)
    const updatedContent = lines.join('\n')

    fs.writeFileSync(envPath, updatedContent, 'utf8')

    // Restart the prolter service
    exec('sudo systemctl restart prolter.service', (error, stdout, stderr) => {
      if (error) {
        console.error('[RESTART_ERROR]', stderr)
      } else {
        console.log('[PROLTER_RESTARTED]', stdout)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[SAVE_ENV_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
