// src/components/network/radius/NasFormModal.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/shared/ui/dialog';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Button } from '@/components/shared/ui/button';
import { Pop } from '@/types/pops';
import { NasType } from './NasTable';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/shared/ui/select';
import { Plus } from 'lucide-react';
import { PopFormModal } from '@/components/settings/system/pop/PopFormModal';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<NasType>) => void;
  pops: Pop[];
  defaultValues?: Partial<NasType>;
};

export function NasFormModal({
  open,
  onClose,
  onSubmit,
  pops,
  defaultValues,
}: Props) {
  const [form, setForm] = React.useState<Partial<NasType>>(defaultValues || {});
  const [localPops, setLocalPops] = React.useState<Pop[]>(pops || []);
  const [isPopModalOpen, setIsPopModalOpen] = React.useState(false);

  React.useEffect(() => {
    setForm(defaultValues || {});
    setLocalPops(pops);
  }, [defaultValues, pops]);

  const handleChange = (key: keyof NasType, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  const handlePopCreated = (newPopData: Omit<Pop, 'id'>) => {
    const newPop: Pop = {
      ...newPopData,
      id: Date.now().toString(), // generate a temporary string ID
      status: 'active',
    };

    const updated = [...localPops, newPop];
    setLocalPops(updated);
    handleChange('pop', newPop);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {form?.id ? 'Edit NAS' : 'Add NAS / RADIUS Server'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <Label>Name</Label>
              <Input
                value={form.shortname || ''}
                onChange={(e) => handleChange('shortname', e.target.value)}
              />
            </div>
            <div>
              <Label>IP Address</Label>
              <Input
                value={form.nasname || ''}
                onChange={(e) => handleChange('nasname', e.target.value)}
              />
            </div>
            <div>
              <Label>Type</Label>
              <Input
                value={form.type || ''}
                onChange={(e) => handleChange('type', e.target.value)}
              />
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label>PoP</Label>
                <Select
                  value={form.pop?.id?.toString()}
                  onValueChange={(val) => {
                    const selected = localPops.find(
                      (p) => p.id.toString() === val
                    );
                    handleChange('pop', selected || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select PoP" />
                  </SelectTrigger>
                  <SelectContent>
                    {localPops.map((pop) => (
                      <SelectItem key={pop.id} value={pop.id.toString()}>
                        {pop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-1"
                onClick={() => setIsPopModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1" /> Add PoP
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>
              {form?.id ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PopFormModal
        open={isPopModalOpen}
        onClose={() => setIsPopModalOpen(false)}
        onCreated={handlePopCreated}
      />
    </>
  );
}
