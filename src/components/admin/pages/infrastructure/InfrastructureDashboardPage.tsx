// src/app/dashboard/infrastructure/page.tsx
'use client'

import * as React from 'react'
import {
  Server,
  MapPinned,
  HardDrive,
  Activity,
  Wrench,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/shared/ui/card'
import { Badge } from '@/components/shared/ui/badge'
import { useLocale } from '@/contexts/LocaleContext'

export default function DashboardPage() {
  const { t } = useLocale()

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="grid gap-6">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Server className="w-5 h-5 text-primary" />
          {t('dashboard.infrastructure.title', 'Infrastructure Dashboard')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* PoPs Overview */}
          <Card className="shadow-md border border-border">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPinned className="h-4 w-4 text-accent" />
                  {t('dashboard.infrastructure.pops', 'Total PoPs')}
                </div>
                <Badge variant="secondary">42</Badge>
              </div>
              <p className="text-2xl font-semibold">15 Active / 2 Offline</p>
            </CardContent>
          </Card>

          {/* Equipment Status */}
          <Card className="shadow-md border border-border">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-primary" />
                  {t('dashboard.infrastructure.equipment_status', 'Equipment Status')}
                </div>
                <Badge variant="secondary">128 Devices</Badge>
              </div>
              <p className="text-2xl font-semibold text-green-500 dark:text-green-400">
                117 Online
              </p>
              <p className="text-sm text-destructive">11 Offline</p>
            </CardContent>
          </Card>

          {/* Backbone Health */}
          <Card className="shadow-md border border-border">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4 text-teal-500 dark:text-teal-400" />
                  {t('dashboard.infrastructure.backbone_health', 'Backbone Health')}
                </div>
                <Badge variant="secondary">5 Routes</Badge>
              </div>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                All Operational
              </p>
            </CardContent>
          </Card>

          {/* Open Work Orders */}
          <Card className="shadow-md border border-border">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                  {t('dashboard.infrastructure.work_orders', 'Open Work Orders')}
                </div>
                <Badge variant="secondary">8</Badge>
              </div>
              <p className="text-2xl font-semibold">5 Assigned</p>
              <p className="text-sm text-muted-foreground">3 Unassigned</p>
            </CardContent>
          </Card>

          {/* Incident Alerts */}
          <Card className="shadow-md border border-border">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  {t('dashboard.infrastructure.alerts', 'Infrastructure Alerts')}
                </div>
                <Badge variant="destructive">2</Badge>
              </div>
              <p className="text-sm text-destructive">
                Fiber cut near Downtown Node
              </p>
              <p className="text-sm text-yellow-500 dark:text-yellow-400">
                High latency in West Backbone
              </p>
            </CardContent>
          </Card>

          {/* Map Preview */}
          <Card className="col-span-1 md:col-span-2 xl:col-span-3 shadow-md border border-border">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                <MapPinned className="h-4 w-4 text-primary" />
                {t('dashboard.infrastructure.map', 'Infrastructure Map')}
              </div>
              <div className="w-full h-64 bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">
                {t('dashboard.infrastructure.map_placeholder', 'Map preview goes here.')}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
