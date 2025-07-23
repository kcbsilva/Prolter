// src/app/wireless/dashboard/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Radio,
  SatelliteDish,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow
} from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import Link from 'next/link';

const wirelessDashboardData = {
  accessPoints: [] as { id: string; name: string; status: string; clients: number; capacity: number; utilization: string }[],
  cpeStats: {
    total: 0,
    online: 0,
    offline: 0,
    nonProvisioned: 0,
  },
  signalStrengths: [
    { range: '-40dBm to -60dBm', count: 0, color: 'text-green-600', icon: SignalHigh },
    { range: '-61dBm to -75dBm', count: 0, color: 'text-yellow-600', icon: SignalMedium },
    { range: '-76dBm to -90dBm', count: 0, color: 'text-red-600', icon: SignalLow },
  ],
};

export function WirelessDashboard() {
  const { t } = useLocale();
  const iconSize = "h-4 w-4";
  const smallIconSize = "h-3 w-3";
  const signalIconSize = "h-3.5 w-3.5";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('wireless_dashboard.title', 'Wireless Dashboard')}</h1>
      </div>

      {/* Access Point Summary */}
      <Card>
        <CardHeader className="pt-3 pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Radio className={`${iconSize} text-primary`} />
            {t('wireless_dashboard.ap_summary_title', 'Access Point Summary')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {wirelessDashboardData.accessPoints.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {wirelessDashboardData.accessPoints.map(ap => (
                <Card key={ap.id} className="flex flex-col">
                  <CardHeader className="pt-3 pb-2">
                    <CardTitle className="text-xs font-medium flex items-center justify-between">
                      {ap.name}
                      <span className={`flex items-center text-xs ${ap.status === 'Online' ? 'text-green-600' : 'text-red-600'}`}>
                        {ap.status === 'Online' ? <CheckCircle className={`mr-1 ${smallIconSize}`} /> : <XCircle className={`mr-1 ${smallIconSize}`} />}
                        {t(`wireless_dashboard.ap_status_${ap.status.toLowerCase()}` as any, ap.status)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-1">
                    <p className="text-xs text-muted-foreground">{t('wireless_dashboard.clients', 'Clients')}: <span className="font-medium text-foreground">{ap.clients} / {ap.capacity}</span></p>
                    <p className="text-xs text-muted-foreground">{t('wireless_dashboard.utilization', 'Utilization')}: <span className="font-medium text-foreground">{ap.utilization}</span></p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                      <Link href={`/wireless/access-points/${ap.id}`}>{t('wireless_dashboard.view_details', 'View Details')}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">{t('wireless_dashboard.no_ap_data')}</p>
          )}
          <div className="mt-4 text-right">
            <Button variant="link" size="sm" asChild className="text-xs">
              <Link href="/wireless/access-points">{t('wireless_dashboard.view_all_aps_button', 'View All APs')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CPE Status + Signal Strength */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pt-3 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <SatelliteDish className={`${iconSize} text-primary`} />
              {t('wireless_dashboard.cpe_status_title', 'CPE Status Overview')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-3 rounded-md border p-3">
                <Users className={`${smallIconSize} text-muted-foreground`} />
                <div>
                  <p className="text-xs text-muted-foreground">{t('wireless_dashboard.total_cpes')}</p>
                  <p className="text-sm font-semibold">{wirelessDashboardData.cpeStats.total.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 rounded-md border p-3">
                <CheckCircle className={`${smallIconSize} text-green-500`} />
                <div>
                  <p className="text-xs text-muted-foreground">{t('wireless_dashboard.cpes_online')}</p>
                  <p className="text-sm font-semibold">{wirelessDashboardData.cpeStats.online.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 rounded-md border p-3">
                <XCircle className={`${smallIconSize} text-red-500`} />
                <div>
                  <p className="text-xs text-muted-foreground">{t('wireless_dashboard.cpes_offline')}</p>
                  <p className="text-sm font-semibold">{wirelessDashboardData.cpeStats.offline.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 rounded-md border p-3">
                <AlertCircle className={`${smallIconSize} text-yellow-500`} />
                <div>
                  <p className="text-xs text-muted-foreground">{t('wireless_dashboard.cpes_non_provisioned')}</p>
                  <p className="text-sm font-semibold">{wirelessDashboardData.cpeStats.nonProvisioned.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-right">
              <Button variant="link" size="sm" asChild className="text-xs">
                <Link href="/wireless/cpes">{t('wireless_dashboard.view_all_cpes_button', 'View All CPEs')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Signal Strength Distribution */}
        <Card>
          <CardHeader className="pt-3 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Signal className={`${iconSize} text-primary`} />
              {t('wireless_dashboard.signal_strength_title', 'Signal Strength Levels')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wirelessDashboardData.signalStrengths.map(level => {
                const IconComponent = level.icon;
                return (
                  <Link
                    key={level.range}
                    href={`/wireless/cpes?signalFilter=${encodeURIComponent(level.range)}`}
                    className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className={`${signalIconSize} ${level.color}`} />
                      <span className="text-xs font-medium">{level.range}</span>
                    </div>
                    <span className={`text-xs font-semibold ${level.color}`}>
                      {level.count} {t('wireless_dashboard.signal_devices', 'CPEs')}
                    </span>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
