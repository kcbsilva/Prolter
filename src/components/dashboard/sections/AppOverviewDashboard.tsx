// src/components/dashboard/sections/AppOverviewDashboard.tsx
'use client';

import * as React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend,
} from 'recharts';
import { Activity, Users, Server, CreditCard, Shield, Bell, Gauge, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Visually appealing, data-rich dashboard focused on the Prolter app itself.
 * Purely client-side demo data; wire to real APIs later.
 */

/* ----------------------------- Demo Data ----------------------------- */

const kpiSpark = [
  { name: 'Jan', v: 820 },
  { name: 'Feb', v: 900 },
  { name: 'Mar', v: 880 },
  { name: 'Apr', v: 1040 },
  { name: 'May', v: 1120 },
  { name: 'Jun', v: 1180 },
  { name: 'Jul', v: 1260 },
];

const mrrTrend = [
  { month: 'Jan', mrr: 38200 },
  { month: 'Feb', mrr: 39400 },
  { month: 'Mar', mrr: 40150 },
  { month: 'Apr', mrr: 42300 },
  { month: 'May', mrr: 44010 },
  { month: 'Jun', mrr: 45231 },
  { month: 'Jul', mrr: 46890 },
];

const moduleUsage = [
  { module: 'Subscribers', count: 1230 },
  { module: 'Finances', count: 980 },
  { module: 'NOC', count: 840 },
  { module: 'Inventory', count: 560 },
  { module: 'Service Calls', count: 730 },
  { module: 'Messenger', count: 410 },
];

const ticketsByStatus = [
  { name: 'Open', value: 23 },
  { name: 'In Progress', value: 14 },
  { name: 'Escalated', value: 6 },
  { name: 'Resolved', value: 58 },
];

const usersByRole = [
  { name: 'Admins', value: 18 },
  { name: 'Workers', value: 64 },
  { name: 'SuperUsers', value: 4 },
];

const uptimeSeries = [
  { d: 'D-6', up: 99.96 },
  { d: 'D-5', up: 99.97 },
  { d: 'D-4', up: 99.9 },
  { d: 'D-3', up: 99.99 },
  { d: 'D-2', up: 100.0 },
  { d: 'D-1', up: 99.98 },
  { d: 'Today', up: 99.98 },
];

const incidents = [
  { id: 1, label: 'NAS Server X-12 unreachable', time: '5m ago', level: 'critical' },
  { id: 2, label: 'Urgent ticket #1099 escalated', time: '20m ago', level: 'warning' },
  { id: 3, label: 'Scheduled maintenance completed', time: '1h ago', level: 'info' },
];

/* ------------------------------ Palette ------------------------------ */

const ORANGE = '#FCA311';
const MIDNIGHT = '#14213D';
const DEEPBLUE = '#233B6E';
const LIGHTGRAY = '#E5E5E5';
const GREEN = '#16a34a';
const RED = '#ef4444';
const BLUE = '#3b82f6';
const PURPLE = '#8b5cf6';

/* ------------------------------ Helpers ------------------------------ */

function KPI({
  icon: Icon,
  title,
  value,
  diff,
  className,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  diff: string;
  className?: string;
}) {
  return (
    <Card className={cn('rounded-2xl shadow-sm', className)}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-xl bg-muted/40">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <div className={cn('text-xs mt-1', diff.startsWith('+') ? 'text-emerald-600' : 'text-red-600')}>
          {diff} from last month
        </div>
        <div className="mt-3 h-14">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={kpiSpark}>
              <Tooltip cursor={{ stroke: LIGHTGRAY }} contentStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="v" stroke={ORANGE} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

/* ----------------------------- The Page ------------------------------ */

export default function AppOverviewDashboard() {
  const [lastUpdated] = React.useState(() => new Date().toLocaleString());

  return (
    <div className="p-6 w-full bg-background">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Prolter Overview</h1>
          <p className="text-sm text-muted-foreground">Real-time snapshot of system usage, health, and business metrics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">
            <Settings className="w-4 h-4 mr-2" />
            Preferences
          </Button>
          <Button className="rounded-xl">
            <Gauge className="w-4 h-4 mr-2" />
            Live Mode
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KPI icon={Users} title="Active Users" value="1,256" diff="+8.1%" />
        <KPI icon={CreditCard} title="Monthly Recurring Revenue" value="$46,890" diff="+3.7%" />
        <KPI icon={Server} title="Active Devices" value="842" diff="+1.2%" />
        <KPI icon={Activity} title="Avg. Response Time" value="42 min" diff="-6.4%" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="rounded-2xl shadow-sm 2xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">MRR Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mrrTrend} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ORANGE} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={ORANGE} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'MRR']} />
                  <Area type="monotone" dataKey="mrr" stroke={ORANGE} strokeWidth={2} fill="url(#mrrFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tickets by Status */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Tickets by Status</CardTitle>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Bell className="w-4 h-4" /> last 24h
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie data={ticketsByStatus} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    <Cell fill={BLUE} />
                    <Cell fill={ORANGE} />
                    <Cell fill={RED} />
                    <Cell fill={GREEN} />
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Module Usage */}
        <Card className="rounded-2xl shadow-sm 2xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Module Usage (past 7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moduleUsage} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="module" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} fill={DEEPBLUE} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Users by Role */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Users by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={usersByRole}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    label
                  >
                    <Cell fill={DEEPBLUE} />
                    <Cell fill={MIDNIGHT} />
                    <Cell fill={ORANGE} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Uptime */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className="text-base">Uptime (last 7 days)</CardTitle>
            <div className="text-xs text-muted-foreground">current 99.98%</div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={uptimeSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="d" />
                  <YAxis domain={[99.8, 100]} tickFormatter={(v) => `${v.toFixed(2)}%`} />
                  <Tooltip formatter={(v: number) => [`${v.toFixed(2)}%`, 'Uptime']} />
                  <Bar dataKey="up" radius={[8, 8, 0, 0]} fill={GREEN} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Health (Radial) + Incidents */}
        <Card className="rounded-2xl shadow-sm 2xl:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="40%"
                    outerRadius="90%"
                    data={[
                      { name: 'API', value: 92, fill: BLUE },
                      { name: 'DB', value: 88, fill: PURPLE },
                      { name: 'Workers', value: 95, fill: ORANGE },
                    ]}
                    startAngle={180}
                    endAngle={0}
                  >
                    {/* Removed minAngle/clockWise (not in your typings) */}
                    <RadialBar dataKey="value" cornerRadius={6} />
                    <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl border p-3">
                <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                  <Shield className="w-4 h-4 text-primary" />
                  Incidents & Notifications
                </div>
                <ul className="space-y-2">
                  {incidents.map((i) => (
                    <li key={i.id} className="flex items-center justify-between text-sm">
                      <span
                        className={cn(
                          'truncate',
                          i.level === 'critical' && 'text-red-600',
                          i.level === 'warning' && 'text-orange-600',
                          i.level === 'info' && 'text-muted-foreground'
                        )}
                        title={i.label}
                      >
                        {i.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{i.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer / Meta */}
      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
        <div>Last updated: {lastUpdated}</div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          All systems operational
        </div>
      </div>
    </div>
  );
}
