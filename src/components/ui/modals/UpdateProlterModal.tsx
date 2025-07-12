'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const steps = [
  { id: 'stop', label: 'Stopping Prolter' },
  { id: 'git', label: 'Getting New Files' },
  { id: 'build', label: 'Installing New Files' },
  { id: 'start', label: 'Applying Changes' },
];

export function UpdateProlterModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const runSteps = async () => {
      setLoading(true);
      setErrors(null);

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        try {
          const res = await fetch(`/api/system/update/step/${step.id}`, { method: 'POST' });
          if (!res.ok) {
            const data = await res.json();
            setErrors(data.error || 'Unknown error');
            break;
          }

          setCurrentStep(i + 1);

          // Wait for animation / visual feedback
          await new Promise(res => setTimeout(res, 500));
        } catch (e: any) {
          setErrors(e.message);
          break;
        }
      }

      setLoading(false);

      // After last step (start), wait and redirect
      if (currentStep === steps.length) {
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    runSteps();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Updating Prolter</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Progress value={(currentStep / steps.length) * 100} />

          <ul className="text-sm list-disc pl-5 space-y-1">
            {steps.map((step, i) => (
              <li key={step.id} className={i < currentStep ? 'text-green-600' : i === currentStep ? 'text-blue-600' : ''}>
                {i < currentStep ? '✅' : i === currentStep ? '🔄' : '⏳'} {step.label}
              </li>
            ))}
          </ul>

          {errors && (
            <div className="text-red-600 text-sm border border-red-500 p-2 rounded">
              ⚠️ Update failed: {errors}
            </div>
          )}

          {!errors && currentStep === steps.length && (
            <div className="text-green-600 text-sm mt-2">✅ Update complete. Redirecting...</div>
          )}

          <div className="flex justify-end">
            <Button disabled={loading} onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
