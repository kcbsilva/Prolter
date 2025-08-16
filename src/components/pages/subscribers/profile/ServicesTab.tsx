// src/components/subscribers/profile/ServicesTab.tsx
'use client';

import * as React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/shared/ui/tabs';
import { Button } from '@/components/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shared/ui/dropdown-menu';
import { Badge } from '@/components/shared/ui/badge';
import { cn } from '@/lib/utils';
import { Wifi, Tv, PhoneCall, Smartphone, ListFilter as ListFilterIcon, Combine as CombineIcon, MoreVertical } from 'lucide-react';
import type { Subscriber, SubscriberService, ServiceStatus } from '@/types/subscribers';
import { Cable, Router as RouterIcon, Globe, Server as ServerIcon } from 'lucide-react';

type ServiceTypeFilter = 'All' | 'Internet' | 'TV' | 'Landline' | 'Mobile' | 'Combo';

const getTechnologyIcon = (technology?: string) => {
  const icon = "h-4 w-4 text-primary";
  if (!technology) return <ServerIcon className={icon} />;
  switch ((technology || '').toLowerCase()) {
    case 'fiber': return <Cable className={icon} />;
    case 'radio': return <Wifi className={icon} />;
    case 'utp': return <RouterIcon className={icon} />;
    case 'satellite': return <Globe className={icon} />;
    default: return <ServerIcon className={icon} />;
  }
};

const badge = (status?: ServiceStatus) =>
  status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

export const ServicesTab: React.FC<{ subscriber: Subscriber }> = ({ subscriber }) => {
  const { t } = useLocale();
  const [activeServiceTab, setActiveServiceTab] = React.useState<ServiceTypeFilter>('All');

  const filtered = (subscriber.services || []).filter(s => activeServiceTab === 'All' || s.type === activeServiceTab);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Tabs value={activeServiceTab} onValueChange={(v) => setActiveServiceTab(v as ServiceTypeFilter)} className="w-full">
          <TabsList className="grid w-full grid-cols-6 h-auto">
            <TabsTrigger value="All"><ListFilterIcon className="mr-1.5 h-3 w-3" />{t('subscriber_profile.services_filter_all')}</TabsTrigger>
            <TabsTrigger value="Internet"><Wifi className="mr-1.5 h-3 w-3" />{t('subscriber_profile.services_filter_internet')}</TabsTrigger>
            <TabsTrigger value="TV"><Tv className="mr-1.5 h-3 w-3" />{t('subscriber_profile.services_filter_tv')}</TabsTrigger>
            <TabsTrigger value="Landline"><PhoneCall className="mr-1.5 h-3 w-3" />{t('subscriber_profile.services_filter_landline')}</TabsTrigger>
            <TabsTrigger value="Mobile"><Smartphone className="mr-1.5 h-3 w-3" />{t('subscriber_profile.services_filter_mobile')}</TabsTrigger>
            <TabsTrigger value="Combo"><CombineIcon className="mr-1.5 h-3 w-3" />{t('subscriber_profile.services_filter_combo')}</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white ml-4 shrink-0">
          + {t('subscriber_profile.add_service_button')}
        </Button>
      </div>

      {filtered.length ? filtered.map(service => (
        <Card key={service.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              {getTechnologyIcon(service.technology)}
              <CardTitle className="text-sm">{service.plan}</CardTitle>
              <Badge className={cn('text-xs', badge(service.status))}>{service.status}</Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>{t('subscriber_profile.service_action_sign')}</DropdownMenuItem>
                <DropdownMenuItem>{t('subscriber_profile.service_action_cancel')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{t('subscriber_profile.service_action_print_service_contract')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 text-xs">
            {service.technology && <div><span className="text-muted-foreground">{t('subscriber_profile.services_technology')}:</span> <span className="font-medium">{service.technology}</span></div>}
            {service.downloadSpeed && service.uploadSpeed && <div><span className="text-muted-foreground">{t('subscriber_profile.services_data_rate')}:</span> <span className="font-medium">{service.downloadSpeed} / {service.uploadSpeed}</span></div>}
            {service.ipAddress && <div><span className="text-muted-foreground">{t('subscriber_profile.services_ip_address')}:</span> <span className="font-medium">{service.ipAddress}</span></div>}
          </CardContent>
        </Card>
      )) : (
        <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground text-center py-4">{t('subscriber_profile.services_none_filtered')}</p></CardContent></Card>
      )}
    </div>
  );
};
