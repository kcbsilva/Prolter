// src/components/noc/RoutersSwitchesPage.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { Router, CheckCircle, XCircle, HardDrive, Server } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import Link from 'next/link';

const mockDevices = [
  {
    id: 'rt-001',
    name: 'Core Router',
    type: 'Router',
    status: 'Online',
    interfaces: 48,
    uptime: '98.7%',
    model: 'Cisco ASR 1000'
  },
  {
    id: 'sw-001',
    name: 'Main Switch',
    type: 'Switch',
    status: 'Online',
    interfaces: 24,
    uptime: '99.2%',
    model: 'Cisco Catalyst 9200'
  },
  {
    id: 'rt-002',
    name: 'Edge Router',
    type: 'Router',
    status: 'Offline',
    interfaces: 32,
    uptime: '0%',
    model: 'MikroTik CCR1036'
  }
];

export function NocRouters() {
  const { t } = useLocale();
  const iconSize = "h-4 w-4";
  const smallIconSize = "h-3 w-3";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('routers_switches.title', 'Routers & Switches')}</h1>
      </div>

      <Card>
        <CardHeader className="pt-3 pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Router className={`${iconSize} text-primary`} />
            {t('routers_switches.list_title', 'Network Devices')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockDevices.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockDevices.map(device => (
                <Card key={device.id} className="flex flex-col">
                  <CardHeader className="pt-3 pb-2">
                    <CardTitle className="text-xs font-medium flex items-center justify-between">
                      {device.name}
                      <span className={`flex items-center text-xs ${device.status === 'Online' ? 'text-green-600' : 'text-red-600'}`}>
                        {device.status === 'Online' ? <CheckCircle className={`mr-1 ${smallIconSize}`} /> : <XCircle className={`mr-1 ${smallIconSize}`} />}
                        {t(`routers_switches.status_${device.status.toLowerCase()}` as any, device.status)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-1">
                    <p className="text-xs text-muted-foreground">{t('routers_switches.type', 'Type')}: 
                      <span className="font-medium text-foreground"> {device.type}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{t('routers_switches.model', 'Model')}: 
                      <span className="font-medium text-foreground"> {device.model}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{t('routers_switches.interfaces', 'Interfaces')}: 
                      <span className="font-medium text-foreground"> {device.interfaces}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{t('routers_switches.uptime', 'Uptime')}: 
                      <span className="font-medium text-foreground"> {device.uptime}</span>
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                      <Link href={`/network/devices/${device.id}`}>
                        {t('routers_switches.view_details', 'View Details')}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              {t('routers_switches.no_data', 'No network devices found.')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}