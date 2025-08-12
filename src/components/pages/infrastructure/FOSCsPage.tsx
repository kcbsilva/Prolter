// src/components/infrastructure/FOSCsPage.tsx
'use client';

import * as React from 'react';
import { Warehouse, FilePlus2, List } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Badge } from '@/components/ui/badge';

const iconSize = 'h-4 w-4';

const foscSchema = z.object({
  manufacturer: z.string().min(1),
  model: z.string().min(1),
  capacity: z.coerce.number().int().positive(),
  tag: z.enum(['BACKBONE', 'PON', 'DWDM']),
});
type FoscTemplate = z.infer<typeof foscSchema> & { id: string };

const manufacturers = ['Furukawa', 'FiberHome', 'Prysmian'];

export default function FOSCsPage() {
  const { t } = useLocale();
  const [open, setOpen] = React.useState(false);
  const [templates, setTemplates] = React.useState<FoscTemplate[]>([]);

  const form = useForm<z.infer<typeof foscSchema>>({
    resolver: zodResolver(foscSchema),
    defaultValues: {
      manufacturer: '',
      model: '',
      capacity: 12,
      tag: 'BACKBONE',
    },
  });

  const onSubmit = (data: z.infer<typeof foscSchema>) => {
    const newTpl = { ...data, id: Date.now().toString() };
    setTemplates((prev) => [...prev, newTpl]);
    form.reset();
    setOpen(false);
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Warehouse className="text-primary h-5 w-5" />
          {t('sidebar.maps_elements_foscs', 'FOSCs')}
        </h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <FilePlus2 className={`${iconSize} mr-2`} />
              {t('maps_elements.fosc_manage_templates', 'Manage FOSC Templates')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold">
                {t('maps_elements.fosc_template_heading', 'New FOSC Template')}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <fieldset className="md:col-span-2 border border-border p-4 rounded-md">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="manufacturer" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manufacturer</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Furukawa" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="model" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., DOM 144F" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="capacity" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="tag" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tag</FormLabel>
                          <FormControl>
                            <select
                              className="w-full border rounded-md text-sm p-2"
                              {...field}
                            >
                              <option value="BACKBONE">BACKBONE</option>
                              <option value="PON">PON</option>
                              <option value="DWDM">DWDM</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <DialogFooter className="pt-4">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Save Template</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </fieldset>

              <fieldset className="border border-border p-4 rounded-md">
                <legend className="text-sm font-medium flex items-center gap-2 px-2">
                  <List className="text-primary h-4 w-4" />
                  Existing Templates
                </legend>
                <ScrollArea className="h-[200px] mt-4">
                  {templates.length ? (
                    templates.map((tpl) => (
                      <div key={tpl.id} className="text-xs p-2 border-b last:border-b-0">
                        <div className="font-medium">
                          {tpl.manufacturer} - {tpl.model}
                        </div>
                        <div className="text-muted-foreground">
                          {tpl.capacity} fibers • <Badge variant="outline">{tpl.tag}</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No templates added.
                    </p>
                  )}
                </ScrollArea>
              </fieldset>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          {t('maps_elements.no_foscs_found', 'No FOSCs found. They are typically added via the map interface.')}
        </CardContent>
      </Card>
    </div>
  );
}
