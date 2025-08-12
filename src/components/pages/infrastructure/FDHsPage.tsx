// src/components/infrastructure/FDHsPage.tsx
'use client';

import * as React from 'react';
import { Box, FileText, FilePlus2, List } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const iconSize = 'h-4 w-4';

const fdhTemplateSchema = z.object({
  manufacturer: z.string().min(1),
  model: z.string().min(1),
  maxPortCapacity: z.coerce.number().int().positive(),
  fdhType: z.enum(['Aerial', 'Underground'])
});
type FdhTemplate = z.infer<typeof fdhTemplateSchema> & { id: string };

const placeholderTemplates: FdhTemplate[] = [];
const manufacturers: string[] = ['Huawei', 'Corning', 'Prysmian'];

export default function FDHsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [templates, setTemplates] = React.useState<FdhTemplate[]>(placeholderTemplates);
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof fdhTemplateSchema>>({
    resolver: zodResolver(fdhTemplateSchema),
    defaultValues: {
      manufacturer: '',
      model: '',
      maxPortCapacity: 16,
      fdhType: 'Aerial'
    }
  });

  const onSubmit = (data: z.infer<typeof fdhTemplateSchema>) => {
    const newTemplate = { ...data, id: Date.now().toString() };
    setTemplates((prev) => [...prev, newTemplate]);
    toast({ title: t('maps_elements.fdh_template_add_success_title', 'FDH Template Added') });
    form.reset();
    setOpen(false);
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Box className="text-primary h-5 w-5" />
          {t('sidebar.maps_elements_fdhs', 'FDHs')}
        </h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <FileText className={`${iconSize} mr-2`} />
              {t('maps_elements.fdh_template_button', 'FDH Templates')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold">
                {t('maps_elements.fdh_manage_templates_title', 'Manage FDH Templates')}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <fieldset className="md:col-span-2 border border-border p-4 rounded-md">
                <legend className="text-sm font-medium flex items-center gap-2 px-2">
                  <FilePlus2 className={`${iconSize} text-primary`} />
                  {t('maps_elements.fdh_new_template_heading', 'New FDH Template')}
                </legend>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="manufacturer" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manufacturer</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select Manufacturer" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {manufacturers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="model" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., OptiSheath" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="maxPortCapacity" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Ports</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="fdhType" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Aerial">Aerial</SelectItem>
                              <SelectItem value="Underground">Underground</SelectItem>
                            </SelectContent>
                          </Select>
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
                    templates.map(tpl => (
                      <div key={tpl.id} className="text-xs p-2 border-b last:border-b-0">
                        <div className="font-medium">{tpl.manufacturer} - {tpl.model}</div>
                        <div className="text-muted-foreground">{tpl.maxPortCapacity} ports • {tpl.fdhType}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">No templates added.</p>
                  )}
                </ScrollArea>
              </fieldset>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          {t('maps_elements.no_fdhs_found', 'No FDHs found. They are typically added via the map interface.')}
        </CardContent>
      </Card>
    </div>
  );
} 
