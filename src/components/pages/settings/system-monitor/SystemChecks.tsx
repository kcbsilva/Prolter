// src/components/pages/SystemMonitor/SystemChecks.tsx
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { Power, ArrowUpCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
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

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [isTogglingDebug, setIsTogglingDebug] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchDebugStatus() {
      try {
        const res = await fetch('/api/debug/status');
        const data = await res.json();
        if (!cancelled) setDebugMode(!!data.debug);
      } catch {
        if (!cancelled) setDebugMode(false);
      }
    }

    fetchDebugStatus();
    const interval = setInterval(fetchDebugStatus, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

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

      toast({ title: t('restart_success'), description: t('restart_success_message') });

      setServices(prev =>
        prev.map(s => (s.id === serviceId ? { ...s, status: 'Active', error: undefined } : s))
      );
    } catch (err: any) {
      toast({ title: t('restart_failed'), description: err.message, variant: 'destructive' });
      setServices(prev =>
        prev.map(s => (s.id === serviceId ? { ...s, status: 'Inactive', error: err.message } : s))
      );
    }
  };

  const handleUpdateService = async (serviceId: string) => {
    if (serviceId === 'prolter') {
      setShowUpdateModal(true);
      return;
    }

    toast({ title: t('update_started'), description: t('updating_service', { service: serviceId }) });

    try {
      const res = await fetch('/api/settings/system-monitor/services/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: serviceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Unknown error');

      toast({ title: t('update_success'), description: data.output || t('update_finished') });
    } catch (err: any) {
      toast({ title: t('update_failed'), description: err.message, variant: 'destructive' });
    }
  };

  const handleToggleDebug = async () => {
    setIsTogglingDebug(true);
    try {
      const res = await fetch('/api/debug/toggle', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');

      const started = data.status === 'started';
      setDebugMode(started);
      toast({
        title: `Debug ${started ? 'Enabled' : 'Stopped'}`,
        description: `Prolter debug mode is now ${data.status}`,
      });
    } catch (err: any) {
      toast({ title: 'Failed to toggle debug mode', description: err.message, variant: 'destructive' });
    } finally {
      setIsTogglingDebug(false);
    }
  };

  // Sort so that "prolter" is always at the top
  const sortedServices = [...services].sort((a, b) => {
    if (a.id === 'prolter') return -1;
    if (b.id === 'prolter') return 1;
    if (a.id === 'ubuntu') return -1;
    if (b.id === 'ubuntu') return 1;
    return 0;
  });

  return (
    <>
      <Card className="lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t('services_status_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedServices.map(service => (
              <div
                key={service.id}
                className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      service.id === 'prolter'
                        ? debugMode
                          ? 'bg-green-500'
                          : 'bg-red-500'
                        : service.status === 'Active'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  />
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

                  {service.id === 'prolter' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={handleToggleDebug}
                      disabled={isTogglingDebug}
                    >
                      {debugMode ? 'Stop Debug' : 'Start Debug'}
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
