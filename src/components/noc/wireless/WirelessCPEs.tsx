// src/components/noc/CPEsPage.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SatelliteDish, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import Link from 'next/link';

const mockCPEs = [
  {
    id: 'cpe-001',
    name: 'John Doe - Roof CPE',
    status: 'Online',
    signal: '-55dBm',
    provisioned: true,
  },
  {
    id: 'cpe-002',
    name: 'Warehouse Unit',
    status: 'Offline',
    signal: '-90dBm',
    provisioned: false,
  },
];

export function CPEs() {
  const { t } = useLocale();
  const iconSize = "h-4 w-4";
  const smallIconSize = "h-3 w-3";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold">{t('cpes.title', 'CPEs')}</h1>
      </div>

      <Card>
        <CardHeader className="pt-3 pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <SatelliteDish className={`${iconSize} text-primary`} />
            {t('cpes.list_title', 'Customer Premises Equipment (CPEs)')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockCPEs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockCPEs.map(cpe => (
                <Card key={cpe.id} className="flex flex-col">
                  <CardHeader className="pt-3 pb-2">
                    <CardTitle className="text-xs font-medium flex items-center justify-between">
                      {cpe.name}
                      <span className={`flex items-center text-xs ${cpe.status === 'Online' ? 'text-green-600' : 'text-red-600'}`}>
                        {cpe.status === 'Online' ? <CheckCircle className={`mr-1 ${smallIconSize}`} /> : <XCircle className={`mr-1 ${smallIconSize}`} />}
                        {t(`cpes.status_${cpe.status.toLowerCase()}` as any, cpe.status)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-1">
                    <p className="text-xs text-muted-foreground">{t('cpes.signal_strength', 'Signal')}: <span className="font-medium text-foreground">{cpe.signal}</span></p>
                    <p className="text-xs text-muted-foreground">{t('cpes.provisioned', 'Provisioned')}: 
                      <span className={`font-medium ${cpe.provisioned ? 'text-green-600' : 'text-yellow-600'} ml-1`}>
                        {cpe.provisioned ? t('cpes.yes', 'Yes') : t('cpes.no', 'No')}
                      </span>
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                      <Link href={`/wireless/cpes/${cpe.id}`}>{t('cpes.view_details', 'View Details')}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">{t('cpes.no_data', 'No CPE data available.')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}