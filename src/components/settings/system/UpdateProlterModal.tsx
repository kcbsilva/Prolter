// src/components/system/UpdateProlterModal.tsx
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export function UpdateProlterModal({ open, onOpenChange }: Props) {
  const [busy, setBusy] = React.useState(false);
  const [output, setOutput] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    const run = async () => {
      setBusy(true);
      setDone(false);
      setError(null);
      setOutput('');

      try {
        const res = await fetch('/api/system/update', { method: 'POST' });
        const text = await res.text();
        setOutput(text);
        if (!res.ok) throw new Error('Update failed');
        setDone(true);
      } catch (e: any) {
        setError(e?.message || 'Unknown error');
      } finally {
        setBusy(false);
      }
    };

    run();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Updating Prolter</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Progress value={busy ? 70 : done ? 100 : error ? 0 : 0} />
          {busy && <div className="text-sm text-muted-foreground">Running update…</div>}
          {done && <div className="text-sm text-green-600">✅ Update complete.</div>}
          {error && <div className="text-sm text-red-600">⚠️ {error}</div>}

          {output && (
            <pre className="text-xs bg-muted p-2 rounded max-h-60 overflow-auto whitespace-pre-wrap">
              {output}
            </pre>
          )}

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)} disabled={busy}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
