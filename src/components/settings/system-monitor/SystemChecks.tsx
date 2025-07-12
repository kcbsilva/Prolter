// src/components/pages/SystemMonitor/SystemChecks.tsx
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Power, ArrowUpCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';

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

const updateSteps = [
  { id: 'stop', label: 'Stopping Prolter' },
  { id: 'git', label: 'Getting New Files' },
  { id: 'build', label: 'Installing New Files' },
  { id: 'start', label: 'Applying Changes' },
];

export function SystemChecks({ services, setServices, isLoading }: Props) {
  const { t } = useLocale();
  const { toast } = useToast();
  const router = useRouter();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
        prev.map(s =>
          s.id === serviceId ? { ...s, status: 'Active', error: undefined } : s
        )
      );
    } catch (err: any) {
      toast({
        title: t('restart_failed'),
        description: err.message,
        variant: 'destructive',
      });

      setServices(prev =>
        prev.map(s =>
          s.id === serviceId ? { ...s, status: 'Inactive', error: err.message } : s
        )
      );
    }
  };

  const handleUpdateService = async (serviceId: string) => {
    if (serviceId === 'prolter') {
      setShowUpdateModal(true);
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

  useEffect(() => {
    if (!showUpdateModal) return;

    const runUpdateSteps = async () => {
      setIsUpdating(true);
      setErrors(null);

      for (let i = 0; i < updateSteps.length; i++) {
        const step = updateSteps[i];
        try {
          const res = await fetch(`/api/system/update/step/${step.id}`, { method: 'POST' });
          if (!res.ok) {
            const data = await res.json();
            setErrors(data?.error || 'Unknown error');
            break;
          }
          setCurrentStep(i + 1);
          await new Promise(res => setTimeout(res, 500));
        } catch (err: any) {
          setErrors(err.message);
          break;
        }
      }

      setIsUpdating(false);

      if (currentStep === updateSteps.length - 1) {
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    runUpdateSteps();
  }, [showUpdateModal]);

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
                  <span
                    className={`h-2.5 w-2.5 rounded-full inline-block ${
                      service.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-xs font-medium">{t(service.nameKey)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {service.error ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs font-semibold text-red-600 min-w-[70px] cursor-help">
                          {t('service_status_error')}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{service.error}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <span
                      className={`text-xs font-semibold min-w-[70px] text-center ${
                        service.status === 'Active' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {service.status === 'Active'
                        ? t('service_status_active')
                        : t('service_status_inactive')}
                    </span>
                  )}

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

      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Updating Prolter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Progress value={(currentStep / updateSteps.length) * 100} />
            <ul className="text-sm list-disc pl-5 space-y-1">
              {updateSteps.map((step, i) => (
                <li
                  key={step.id}
                  className={
                    i < currentStep
                      ? 'text-green-600'
                      : i === currentStep
                      ? 'text-blue-600'
                      : 'text-muted-foreground'
                  }
                >
                  {i < currentStep
                    ? '✅'
                    : i === currentStep
                    ? '🔄'
                    : '⏳'}{' '}
                  {step.label}
                </li>
              ))}
            </ul>
            {errors && (
              <div className="text-red-600 text-sm border border-red-500 p-2 rounded">
                ⚠️ Update failed: {errors}
              </div>
            )}
            {!errors && currentStep === updateSteps.length && (
              <div className="text-green-600 text-sm">✅ Update complete. Redirecting...</div>
            )}
            <div className="flex justify-end">
              <Button onClick={() => setShowUpdateModal(false)} disabled={isUpdating}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
