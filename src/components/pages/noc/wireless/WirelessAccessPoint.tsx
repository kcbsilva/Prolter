// src/components/noc/AccessPointsPage.tsx
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
import { Wifi, CheckCircle, XCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import Link from 'next/link';

const mockAccessPoints = [
  {
    id: 'ap-001',
    name: 'Main Tower AP',
    status: 'Online',
    clients: 42,
    capacity: 100,
    utilization: '42%'
  },
  {
    id: 'ap-002',
    name: 'Warehouse AP',
    status: 'Offline',
    clients: 0,
    capacity: 50,
    utilization: '0%'
  }
];

export function AccessPoints() {
  const { t } = useLocale();
  const iconSize = "h-4 w-4";
  const smallIconSize = "h-3 w-3";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('access_points.title', 'Access Points')}</h1>
      </div>

      <Card>
        <CardHeader className="pt-3 pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wifi className={`${iconSize} text-primary`} />
            {t('access_points.list_title', 'Access Point List')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockAccessPoints.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockAccessPoints.map(ap => (
                <Card key={ap.id} className="flex flex-col">
                  <CardHeader className="pt-3 pb-2">
                    <CardTitle className="text-xs font-medium flex items-center justify-between">
                      {ap.name}
                      <span className={`flex items-center text-xs ${ap.status === 'Online' ? 'text-green-600' : 'text-red-600'}`}>
                        {ap.status === 'Online' ? <CheckCircle className={`mr-1 ${smallIconSize}`} /> : <XCircle className={`mr-1 ${smallIconSize}`} />}
                        {t(`access_points.status_${ap.status.toLowerCase()}` as any, ap.status)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-1">
                    <p className="text-xs text-muted-foreground">{t('access_points.clients', 'Clients')}: <span className="font-medium text-foreground">{ap.clients} / {ap.capacity}</span></p>
                    <p className="text-xs text-muted-foreground">{t('access_points.utilization', 'Utilization')}: <span className="font-medium text-foreground">{ap.utilization}</span></p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                      <Link href={`/wireless/access-points/${ap.id}`}>{t('access_points.view_details', 'View Details')}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">{t('access_points.no_data', 'No access point data available.')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}