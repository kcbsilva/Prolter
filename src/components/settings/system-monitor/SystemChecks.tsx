// ✅ FRONTEND: src/components/pages/SystemMonitor/SystemChecks.tsx
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Power, ArrowUpCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { UpdateProlterModal } from '@/components/settings/system/UpdateProlterModal';

interface MonitoredService {
  id: string;
  nameKey: string;
  status: 'Active' | 'Inactive';
  error?: string;
}

interface Props {
  services: MonitoredService[];
  setServices: React.Dispatch<React.SetStateAction<MonitoredService[]>>;
  isLoading: boolean;
}

export function SystemChecks({ services, setServices, isLoading }: Props) {
  const { t } = useLocale();
  const { toast } = useToast();
  const router = useRouter();

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleRestartService = async (serviceId: string) => {
    toast({
      title: t('restart_action_toast_title'),
      description: t('restart_action_toast_desc', { serviceName: serviceId }),
    });

    try {
      const res = await fetch('/api/settings/system-monitor/services/restart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: serviceId }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Unknown error');

      toast({
        title: t('restart_success'),
        description: t('restart_success_message'),
      });

      setServices(prev =>
        prev.map(s => (s.id === serviceId ? { ...s, status: 'Active', error: undefined } : s))
      );
    } catch (err: any) {
      toast({
        title: t('restart_failed'),
        description: err.message,
        variant: 'destructive',
      });
      setServices(prev =>
        prev.map(s => (s.id === serviceId ? { ...s, status: 'Inactive', error: err.message } : s))
      );
    }
  };

  const handleUpdateService = async (serviceId: string) => {
    if (serviceId === 'prolter') {
      try {
        const res = await fetch('/api/system/update/preflight');
        const data = await res.json();

        if (!res.ok || data.success === false) {
          toast({
            title: 'Permission Issue',
            description: data.issues?.join('\n') || data.error || 'Unknown error',
            variant: 'destructive',
          });
          return;
        }

        setShowUpdateModal(true);
      } catch (err: any) {
        toast({
          title: 'Preflight Failed',
          description: err.message,
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: t('update_started'),
        description: t('updating_service', { service: serviceId }),
      });

      try {
        const res = await fetch('/api/settings/system-monitor/services/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ service: serviceId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Unknown error');

        toast({
          title: t('update_success'),
          description: data.output || t('update_finished'),
        });
      } catch (err: any) {
        toast({
          title: t('update_failed'),
          description: err.message,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <>
      <Card className="lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t('services_status_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {services.map(service => (
              <div
                key={service.id}
                className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${service.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs font-medium">{t(service.nameKey)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleRestartService(service.id)}
                    disabled={isLoading}
                  >
                    <Power className="mr-1.5 h-3 w-3" />
                    {t('service_action_restart')}
                  </Button>
                  {['ubuntu', 'prolter'].includes(service.id) && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleUpdateService(service.id)}
                      disabled={isLoading}
                    >
                      <ArrowUpCircle className="mr-1.5 h-3 w-3" />
                      {t('service_action_update')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <UpdateProlterModal open={showUpdateModal} onOpenChange={setShowUpdateModal} />
    </>
  );
}
