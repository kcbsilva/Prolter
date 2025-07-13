// ✅ COMPONENT: src/components/system/UpdateProlterModal.tsx
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface UpdateProlterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const updateSteps = [
  { id: 'git', label: 'Getting New Files' },
  { id: 'build', label: 'Installing New Files' },
  { id: 'restart', label: 'Restarting Prolter' },
];

export function UpdateProlterModal({ open, onOpenChange }: UpdateProlterModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [errors, setErrors] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [rawOutput, setRawOutput] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;

    const runUpdateSteps = async () => {
      setIsUpdating(true);
      setErrors(null);
      setRawOutput(null);
      setCurrentStep(0);

      for (let i = 0; i < updateSteps.length; i++) {
        const step = updateSteps[i];
        try {
          const res = await fetch(`/api/system/update/step/${step.id}`, { method: 'POST' });

          if (!res.ok) {
            // Try to parse JSON, fall back to raw text (for <html> errors)
            let errorMessage;
            try {
              const data = await res.json();
              errorMessage = data?.error || 'Unknown JSON error';
              setRawOutput(JSON.stringify(data, null, 2));
            } catch {
              const rawText = await res.text();
              errorMessage = rawText.includes('<!DOCTYPE')
                ? 'Received HTML instead of JSON. The API route may be missing or broken.'
                : rawText;
              setRawOutput(rawText);
            }

            setErrors(`${step.label} failed:\n${errorMessage}`);
            break;
          }

          const data = await res.json();
          setRawOutput(data?.output || null);

          setCurrentStep(i + 1);
          await new Promise(res => setTimeout(res, 600));
        } catch (err: any) {
          setErrors(`Fetch error: ${err.message}`);
          break;
        }
      }

      setIsUpdating(false);

      if (currentStep === updateSteps.length - 1) {
        setTimeout(() => router.push('/login'), 1500);
      }
    };

    runUpdateSteps();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                className={i < currentStep ? 'text-green-600' : i === currentStep ? 'text-blue-600' : 'text-muted-foreground'}
              >
                {i < currentStep ? '✅' : i === currentStep ? '🔄' : '⏳'} {step.label}
              </li>
            ))}
          </ul>

          {rawOutput && (
            <pre className="text-xs bg-muted p-2 rounded max-h-60 overflow-auto whitespace-pre-wrap">
              {rawOutput}
            </pre>
          )}

          {errors && (
            <div className="text-red-600 text-sm border border-red-500 p-2 rounded whitespace-pre-wrap">
              ⚠️ Update failed: {errors}
            </div>
          )}

          {!errors && currentStep === updateSteps.length && (
            <div className="text-green-600 text-sm">✅ Update complete. Redirecting...</div>
          )}

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)} disabled={isUpdating}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
