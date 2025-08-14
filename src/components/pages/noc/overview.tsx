// src/app/noc/overview/page.tsx
'use client'

import * as React from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRightLeft,
  BarChart3,
  Bell,
  Cpu,
  Download,
  Globe2,
  Link,
  Network,
  Radio,
  RefreshCw,
  Server,
  ShieldCheck,
  SignalHigh,
  TimerReset,
  Wifi,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// Charts
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

// ---------------------------------------------
// Mock Data (replace with real data later)
// ---------------------------------------------
const trafficData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  rx: Math.round(150 + Math.random() * 200), // Mbps
  tx: Math.round(130 + Math.random() * 180),
}))

const latencyData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  core: Math.round(8 + Math.random() * 6),
  access: Math.round(12 + Math.random() * 10),
}))

const deviceHealth = [
  { name: 'Healthy', value: 76 },
  { name: 'Warning', value: 18 },
  { name: 'Critical', value: 6 },
]

const healthColors = ['#16a34a', '#f59e0b', '#ef4444']

const incidents = [
  { id: 'INC-1042', sev: 'P1', title: 'Core link flap (SP-RJ)', ago: '7m', status: 'Investigating' },
  { id: 'INC-1041', sev: 'P2', title: 'High latency - North PoP', ago: '28m', status: 'Mitigating' },
  { id: 'INC-1040', sev: 'P3', title: 'AP offline - Zone 3', ago: '1h', status: 'Monitoring' },
]

const topTalkers = [
  { name: 'FTTx-OLT-01', in: 420, out: 310 },
  { name: 'Edge-RTR-SUL', in: 365, out: 295 },
  { name: 'Metro-PE-02', in: 330, out: 280 },
  { name: 'Backbone-01', in: 310, out: 300 },
]

const regions = [
  { name: 'North', status: 'ok' },
  { name: 'Northeast', status: 'warn' },
  { name: 'Midwest', status: 'ok' },
  { name: 'Southeast', status: 'ok' },
  { name: 'South', status: 'crit' },
]

// ---------------------------------------------
// KPI Card helper
// ---------------------------------------------
function Kpi({
  icon: Icon,
  label,
  value,
  sublabel,
  tone = 'default',
}: {
  icon: React.ElementType
  label: string
  value: string
  sublabel?: string
  tone?: 'default' | 'ok' | 'warn' | 'crit'
}) {
  const toneClasses = {
    default: 'text-foreground',
    ok: 'text-green-600 dark:text-green-400',
    warn: 'text-amber-600 dark:text-amber-400',
    crit: 'text-red-600 dark:text-red-400',
  }
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={cn('p-3 rounded-xl bg-muted', tone !== 'default' && 'bg-muted/60')}>
          <Icon className={cn('h-6 w-6', toneClasses[tone])} />
        </div>
        <div className="flex-1">
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold leading-tight">{value}</div>
          {sublabel && <div className="text-xs text-muted-foreground mt-0.5">{sublabel}</div>}
        </div>
      </CardContent>
    </Card>
  )
}

export function NocOverview() {
  const [period, setPeriod] = React.useState('last_24h')
  const [live, setLive] = React.useState(true)
  const [search, setSearch] = React.useState('')

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-primary/5">
              <Network className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold leading-tight">NOC Overview</h1>
              <p className="text-sm text-muted-foreground">Live status of your backbone, access, and services</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Quick filter (device, region, tag)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-[260px] rounded-xl"
            />
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="h-9 w-[160px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_1h">Last 1 hour</SelectItem>
                <SelectItem value="last_6h">Last 6 hours</SelectItem>
                <SelectItem value="last_24h">Last 24 hours</SelectItem>
                <SelectItem value="last_7d">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-background">
              <Switch id="live" checked={live} onCheckedChange={setLive} />
              <label htmlFor="live" className="text-sm">Live</label>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-xl">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Kpi icon={ShieldCheck} label="Uptime (30d)" value="99.982%" sublabel="SLA target 99.95%" tone="ok" />
          <Kpi icon={AlertTriangle} label="Active Alarms" value="12" sublabel="3 critical, 4 warning" tone="warn" />
          <Kpi icon={TimerReset} label="Avg Latency" value="12.4 ms" sublabel="core 9.2 ms • access 15.6 ms" />
          <Kpi icon={ArrowRightLeft} label="Peak Traffic" value="4.8 Gbps" sublabel="at 14:00 BRT" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
          {/* Traffic Card */}
          <Card className="rounded-2xl shadow-sm 2xl:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg"><BarChart3 className="h-5 w-5" /> Traffic (Mbps)</CardTitle>
                  <CardDescription>Backbone RX/TX throughput</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">Backbone</Badge>
                  <Badge variant="secondary" className="rounded-full">All regions</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ left: 6, right: 16, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rx" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="currentColor" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="tx" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="currentColor" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" tickMargin={8} tick={{ fontSize: 12 }} />
                  <YAxis tickMargin={8} tick={{ fontSize: 12 }} />
                  <ReTooltip formatter={(v: number) => `${v} Mbps`} />
                  <Area type="monotone" dataKey="rx" name="RX" stroke="currentColor" fill="url(#rx)" strokeWidth={2} />
                  <Area type="monotone" dataKey="tx" name="TX" stroke="currentColor" fill="url(#tx)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device Health */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg"><Cpu className="h-5 w-5" /> Device Health</CardTitle>
              <CardDescription>Fleet status breakdown</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceHealth} cx="50%" cy="48%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                    {deviceHealth.map((_, i) => (
                      <Cell key={i} fill={healthColors[i % healthColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-sm">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: healthColors[0] }} />Healthy {deviceHealth[0].value}%</div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: healthColors[1] }} />Warning {deviceHealth[1].value}%</div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: healthColors[2] }} />Critical {deviceHealth[2].value}%</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
          {/* Latency */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg"><TimerReset className="h-5 w-5" /> Latency (ms)</CardTitle>
              <CardDescription>Core vs Access</CardDescription>
            </CardHeader>
            <CardContent className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyData} margin={{ left: 6, right: 16, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" tickMargin={8} tick={{ fontSize: 12 }} />
                  <YAxis tickMargin={8} tick={{ fontSize: 12 }} />
                  <ReTooltip formatter={(v: number) => `${v} ms`} />
                  <Line type="monotone" dataKey="core" name="Core" stroke="currentColor" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="access" name="Access" stroke="currentColor" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Incidents */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg"><Bell className="h-5 w-5" /> Incidents</CardTitle>
              <CardDescription>Last 2 hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {incidents.map((it) => (
                <div key={it.id} className="flex items-center justify-between rounded-xl border p-3">
                  <div className="flex items-center gap-3">
                    <Badge className={cn('rounded-full', it.sev === 'P1' && 'bg-red-600 hover:bg-red-600', it.sev === 'P2' && 'bg-amber-600 hover:bg-amber-600')}>{it.sev}</Badge>
                    <div>
                      <div className="font-medium leading-tight">{it.title}</div>
                      <div className="text-xs text-muted-foreground">{it.id} • {it.ago} ago</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full">{it.status}</Badge>
                </div>
              ))}
              <Button variant="ghost" className="w-full rounded-xl">View timeline</Button>
            </CardContent>
          </Card>

          {/* Regions */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg"><Globe2 className="h-5 w-5" /> Regions</CardTitle>
              <CardDescription>Brazil footprint (mock)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {regions.map((r) => (
                  <div key={r.name} className="p-3 rounded-xl border flex flex-col items-center justify-center gap-2">
                    <div className={cn('h-2 w-2 rounded-full', r.status === 'ok' && 'bg-green-500', r.status === 'warn' && 'bg-amber-500', r.status === 'crit' && 'bg-red-500')} />
                    <div className="text-xs text-muted-foreground">{r.name}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">Replace with mini-map when ready.</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
          {/* Top Talkers */}
          <Card className="rounded-2xl shadow-sm 2xl:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg"><ArrowRightLeft className="h-5 w-5" /> Top Talkers</CardTitle>
              <CardDescription>Interfaces by inbound/outbound Mbps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2">Interface</th>
                      <th className="py-2">Inbound</th>
                      <th className="py-2">Outbound</th>
                      <th className="py-2">Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTalkers.map((t) => {
                      const util = Math.min(100, Math.round(((t.in + t.out) / 2000) * 100))
                      return (
                        <tr key={t.name} className="border-t">
                          <td className="py-2 font-medium">{t.name}</td>
                          <td className="py-2">{t.in} Mbps</td>
                          <td className="py-2">{t.out} Mbps</td>
                          <td className="py-2">
                            <div className="h-2 rounded-full bg-muted">
                              <div className="h-2 rounded-full bg-primary" style={{ width: `${util}%` }} />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg"><Wifi className="h-5 w-5" /> Services</CardTitle>
              <CardDescription>Control plane & auth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: 'RADIUS', status: 'ok', icon: Server },
                { name: 'BGP Sessions', status: 'warn', icon: Link },
                { name: 'DHCP Pool', status: 'ok', icon: Radio },
                { name: 'Monitoring', status: 'ok', icon: Activity },
              ].map((svc) => (
                <div key={svc.name} className="flex items-center justify-between rounded-xl border p-3">
                  <div className="flex items-center gap-3">
                    <svc.icon className="h-4 w-4" />
                    <span className="font-medium">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 rounded-full', svc.status === 'ok' && 'bg-green-500', svc.status === 'warn' && 'bg-amber-500', svc.status === 'crit' && 'bg-red-500')} />
                    <span className="text-sm text-muted-foreground">{svc.status === 'ok' ? 'Healthy' : svc.status === 'warn' ? 'Degraded' : 'Down'}</span>
                  </div>
                </div>
              ))}
              <div className="pt-1">
                <Button variant="ghost" className="w-full rounded-xl">View all services</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer hint */}
        <div className="text-xs text-muted-foreground text-center py-2">
          Data is mocked. Wire these cards to your APIs or DB when ready.
        </div>
      </div>
    </TooltipProvider>
  )
}
