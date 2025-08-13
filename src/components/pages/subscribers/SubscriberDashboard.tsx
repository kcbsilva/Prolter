// src/app/subscribers/dashboard/page.tsx
'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Users, UserCheck, UserX, TrendingUp, Download, Plus, Filter, CalendarDays, Search, CircleDollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

// ——— Mock Data (replace with live API later) ———
const periods = [
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: '90d', label: 'Last 90 days' },
  { key: 'ytd', label: 'Year to date' },
]

const subscribersOverTime = [
  { date: 'Aug 01', total: 820, active: 770, churned: 6 },
  { date: 'Aug 04', total: 842, active: 790, churned: 4 },
  { date: 'Aug 07', total: 858, active: 804, churned: 5 },
  { date: 'Aug 10', total: 874, active: 820, churned: 3 },
  { date: 'Aug 13', total: 891, active: 835, churned: 2 },
]

const planMix = [
  { name: 'Free', value: 84 },
  { name: 'Basic 20 Mbps', value: 402 },
  { name: 'Full 50 Mbps', value: 305 },
]

const statusDist = [
  { name: 'Active', value: 835 },
  { name: 'Inactive', value: 56 },
  { name: 'Suspended', value: 12 },
]

const overdueInvoices = [
  { id: 'INV-10041', name: 'Ana Souza', plan: 'Full 50', due: '2025-08-05', amount: 170.0, days: 8 },
  { id: 'INV-10028', name: 'Carlos Lima', plan: 'Basic 20', due: '2025-08-01', amount: 170.0, days: 12 },
  { id: 'INV-10012', name: 'João Pedro', plan: 'Basic 20', due: '2025-07-28', amount: 170.0, days: 16 },
  { id: 'INV-10055', name: 'Maria Clara', plan: 'Full 50', due: '2025-08-07', amount: 170.0, days: 6 },
  { id: 'INV-10071', name: 'Luiz Silva', plan: 'Free', due: '—', amount: 0, days: 0 },
]

const upcomingRenewals = [
  { id: 'SUB-912', name: 'Rafael A.', plan: 'Full 50', renews: '2025-08-20' },
  { id: 'SUB-833', name: 'Juliana M.', plan: 'Basic 20', renews: '2025-08-20' },
  { id: 'SUB-774', name: 'Paulo V.', plan: 'Basic 20', renews: '2025-08-19' },
  { id: 'SUB-669', name: 'Clara S.', plan: 'Full 50', renews: '2025-08-18' },
]

const topBandwidthUsers = [
  { id: 'SUB-388', name: 'Diego N.', plan: 'Full 50', usageGb: 486 },
  { id: 'SUB-144', name: 'Fernanda R.', plan: 'Full 50', usageGb: 432 },
  { id: 'SUB-512', name: 'Tiago F.', plan: 'Basic 20', usageGb: 401 },
  { id: 'SUB-271', name: 'Marcos P.', plan: 'Basic 20', usageGb: 380 },
]

const PIE_COLORS = ['#E5E5E5', '#233B6E', '#FCA311']

export default function SubscriberDashboard() {
  const [period, setPeriod] = React.useState('30d')
  const [search, setSearch] = React.useState('')
  const [planFilter, setPlanFilter] = React.useState<string>('all')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')

  // Derive KPIs (replace ARPU when wiring to backend)
  const total = subscribersOverTime.at(-1)?.total ?? 0
  const active = subscribersOverTime.at(-1)?.active ?? 0
  const inactive = Math.max(total - active, 0)
  const churnRate = ((subscribersOverTime.reduce((acc, d) => acc + d.churned, 0) / (subscribersOverTime[0]?.total || 1)) * 100).toFixed(2)
  const estimatedMRR = active * 170 // R$ 170 worst-case ARPU from context

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Users className="h-7 w-7 text-[#FCA311]" /> Subscribers Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]">
              <CalendarDays className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {periods.map(p => (
                <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Subscriber
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-[360px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subscribers, IDs, emails…" className="pl-9" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Plan" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="basic20">Basic 20 Mbps</SelectItem>
              <SelectItem value="full50">Full 50 Mbps</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Subscribers" value={total.toLocaleString()} icon={Users} subtitle={
          <span><Badge variant="secondary" className="mr-2">All</Badge> as of today</span>
        } />
        <KpiCard title="Active" value={active.toLocaleString()} icon={UserCheck} accent="success" subtitle={<span><Badge className="mr-2 bg-[#233B6E]">Live</Badge> billed</span>} />
        <KpiCard title="Inactive" value={inactive.toLocaleString()} icon={UserX} accent="muted" subtitle={<span><Badge variant="outline" className="mr-2">Idle</Badge> not billed</span>} />
        <KpiCard title="Est. MRR" value={`R$ ${estimatedMRR.toLocaleString('pt-BR')}`} icon={CircleDollarSign} accent="warning" subtitle={<span>ARPU ≈ R$170</span>} />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">Growth & Churn</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={subscribersOverTime} margin={{ left: 4, right: 8 }}>
                <defs>
                  <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#233B6E" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#233B6E" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="active" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FCA311" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#FCA311" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="total" stroke="#233B6E" fillOpacity={1} fill="url(#total)" />
                <Area type="monotone" dataKey="active" stroke="#FCA311" fillOpacity={1} fill="url(#active)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Plan Mix</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planMix} dataKey="value" nameKey="name" outerRadius={90} innerRadius={52}>
                  {planMix.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Status Distribution</CardTitle></CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusDist}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Overdue Invoices</CardTitle>
            <Badge variant="destructive">Risk Watch</Badge>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Subscriber</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Days Late</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overdueInvoices.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.id}</TableCell>
                      <TableCell>{o.name}</TableCell>
                      <TableCell>{o.plan}</TableCell>
                      <TableCell>{o.due}</TableCell>
                      <TableCell className="text-right">{o.amount ? `R$ ${o.amount.toFixed(2)}` : '—'}</TableCell>
                      <TableCell className={cn('text-right', o.days >= 10 && 'text-red-600 font-semibold')}>{o.days || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity & Usage */}
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Upcoming Renewals (Next 7 days)</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Renews</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingRenewals.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.id}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.plan}</TableCell>
                      <TableCell>{r.renews}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Top Bandwidth Users (30d)</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="text-right">Usage (GB)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topBandwidthUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.id}</TableCell>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.plan}</TableCell>
                      <TableCell className="text-right">{u.usageGb}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Meta */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickStat icon={TrendingUp} label="Churn Rate (period)" value={`${churnRate}%`} hint="Total lost ÷ starting total" />
        <QuickStat icon={UserCheck} label="Net Adds (period)" value={`+${(subscribersOverTime.at(-1)!.total - subscribersOverTime[0]!.total).toLocaleString()}`} hint="Gross adds − churn" />
        <QuickStat icon={Users} label="Avg. Actives" value={Math.round(subscribersOverTime.reduce((a, d) => a + d.active, 0) / subscribersOverTime.length).toLocaleString()} hint="Mean active subs" />
      </div>
    </div>
  )
}

function KpiCard({
  title,
  value,
  icon: Icon,
  subtitle,
  accent = 'default',
}: {
  title: string
  value: string | number
  icon: React.ElementType
  subtitle?: React.ReactNode
  accent?: 'default' | 'success' | 'warning' | 'muted'
}) {
  const ring =
    accent === 'success' ? 'ring-emerald-500/30' :
    accent === 'warning' ? 'ring-[#FCA311]/40' :
    accent === 'muted' ? 'ring-gray-300/40' :
    'ring-[#233B6E]/30'

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className={cn('overflow-hidden border', ring)}>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className={cn('h-5 w-5', accent === 'warning' ? 'text-[#FCA311]' : 'text-[#233B6E]')} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tracking-tight">{value}</div>
          {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function QuickStat({ icon: Icon, label, value, hint }: { icon: React.ElementType; label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-lg font-semibold">{value}</div>
          {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
        </div>
        <Icon className="h-6 w-6 text-[#233B6E]" />
      </CardContent>
    </Card>
  )
}

// ——— Utilities ———
function exportCsv() {
  // Minimal CSV export for the demo tables; replace with backend export
  const rows = [
    ['type', 'id', 'name', 'plan', 'date', 'amount', 'daysLate', 'usageGb'],
    ...overdueInvoices.map(o => ['overdue', o.id, o.name, o.plan, o.due, o.amount, o.days, '']),
    ...upcomingRenewals.map(r => ['renewal', r.id, r.name, r.plan, r.renews, '', '', '']),
    ...topBandwidthUsers.map(u => ['usage', u.id, u.name, u.plan, '', '', '', u.usageGb]),
  ]
  const csv = rows.map(r => r.map(x => (x ?? '').toString().replace(/"/g, '""')).map(x => `"${x}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'subscribers-dashboard.csv'
  a.click()
  URL.revokeObjectURL(url)
}
