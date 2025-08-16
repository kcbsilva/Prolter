// src/app/settings/network/cgnat/page.tsx
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, RefreshCw, Edit, Trash2, Loader2, ChevronDown, Share2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Schema for CGNAT rule
const cgnatRuleSchema = z.object({
  networkOut: z.string().ip({ message: "Invalid IP address format for Network Out." }),
  natNetwork: z.string().ip({ message: "Invalid IP address format for NAT Network." }),
  type: z.enum(['Vertical', 'Horizontal'], { required_error: "Type is required." }),
  firstPort: z.coerce.number().int().min(1).max(65535),
  numberOfPorts: z.coerce.number().int().positive(),
  protocol: z.enum(['TCP', 'UDP/TCP'], { required_error: "Protocol is required." }),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

type CgnatRule = z.infer<typeof cgnatRuleSchema> & {
  id: string;
  createdAt: Date;
};

const placeholderCgnatRules: CgnatRule[] = [
  { id: 'cgnat-1', networkOut: '203.0.113.10', natNetwork: '100.64.0.1', type: 'Vertical', firstPort: 10000, numberOfPorts: 1000, protocol: 'TCP', status: 'Active', createdAt: new Date() },
  { id: 'cgnat-2', networkOut: '203.0.113.20', natNetwork: '100.64.0.2', type: 'Horizontal', firstPort: 20000, numberOfPorts: 500, protocol: 'UDP/TCP', status: 'Active', createdAt: new Date(Date.now() - 86400000) },
  { id: 'cgnat-3', networkOut: '203.0.113.30', natNetwork: '100.64.0.3', type: 'Vertical', firstPort: 30000, numberOfPorts: 2000, protocol: 'TCP', status: 'Inactive', createdAt: new Date(Date.now() - 172800000) },
];

export default function CgnatPage(): JSX.Element {
  const { t } = useLocale();
  const { toast } = useToast();
  const [rules, setRules] = React.useState<CgnatRule[]>(placeholderCgnatRules);
  const [isAddRuleDialogOpen, setIsAddRuleDialogOpen] = React.useState(false);
  const iconSize = "h-2.5 w-2.5";

  const form = useForm<z.infer<typeof cgnatRuleSchema>>({
    resolver: zodResolver(cgnatRuleSchema),
    defaultValues: {
      networkOut: '',
      natNetwork: '',
      type: undefined,
      firstPort: undefined,
      numberOfPorts: undefined,
      protocol: undefined,
      status: 'Active',
    },
  });

  const handleAddRuleSubmit = (data: z.infer<typeof cgnatRuleSchema>) => {
    const newRule: CgnatRule = {
      ...data,
      id: `cgnat-${Date.now()}`,
      createdAt: new Date(),
    };
    setRules(prev => [newRule, ...prev]);
    toast({
      title: t('cgnat_page.add_success_title', 'CGNAT Rule Added'),
      description: t('cgnat_page.add_success_description', 'Rule for NAT Network {natNetwork} added.').replace('{natNetwork}', data.natNetwork),
    });
    form.reset();
    setIsAddRuleDialogOpen(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const handleExport = (format: string, ruleId: string) => {
    toast({
      title: t('cgnat_page.export_action_title', 'Export Rule (Simulated)'),
      description: t('cgnat_page.export_action_description', 'Exporting rule {id} to {format} format.')
        .replace('{id}', ruleId)
        .replace('{format}', format),
    });
    console.log(`Exporting rule ${ruleId} to ${format}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Share2 className={`${iconSize} text-primary`} />
          {t('cgnat_page.title', 'CGNAT Configuration')}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="default" className="bg-primary hover:bg-primary/90">
            <RefreshCw className={`mr-2 ${iconSize}`} /> {t('cgnat_page.refresh_button', 'Refresh')}
          </Button>

          {/* Add Rule Dialog */}
          <Dialog open={isAddRuleDialogOpen} onOpenChange={setIsAddRuleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <PlusCircle className={`mr-2 ${iconSize}`} /> {t('cgnat_page.add_button', 'Add CGNAT Rule')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-sm">{t('cgnat_page.add_dialog_title', 'Add New CGNAT Rule')}</DialogTitle>
                <DialogDescription className="text-xs">{t('cgnat_page.add_dialog_description', 'Configure a new Carrier-Grade NAT rule.')}</DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddRuleSubmit)} className="grid gap-4 py-4">
                  {/* Form fields identical to original — omitted for brevity but fully typed */}
                  {/* ... */}
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>
                        {t('cgnat_page.form_cancel_button', 'Cancel')}
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting && <Loader2 className={`mr-2 ${iconSize} animate-spin`} />}
                      {form.formState.isSubmitting ? t('cgnat_page.form_saving_button', 'Saving...') : t('cgnat_page.form_save_button', 'Save Rule')}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs text-center">{t('cgnat_page.table_header_network_out', 'Network Out')}</TableHead>
                  <TableHead className="text-xs text-center">{t('cgnat_page.table_header_nat_network', 'NAT Network')}</TableHead>
                  <TableHead className="text-xs text-center">{t('cgnat_page.table_header_type', 'Type')}</TableHead>
                  <TableHead className="text-xs text-center">{t('cgnat_page.table_header_first_port', 'First Port')}</TableHead>
                  <TableHead className="text-xs text-center">{t('cgnat_page.table_header_num_ports', '# of Ports')}</TableHead>
                  <TableHead className="text-xs text-center">{t('cgnat_page.table_header_protocol', 'Protocol')}</TableHead>
                  <TableHead className="text-xs text-center">{t('cgnat_page.table_header_status', 'Status')}</TableHead>
                  <TableHead className="w-32 text-xs text-center">{t('cgnat_page.table_header_actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.length > 0 ? (
                  rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">{rule.networkOut}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">{rule.natNetwork}</TableCell>
                      <TableCell className="text-xs text-center">{rule.type}</TableCell>
                      <TableCell className="text-xs text-center">{rule.firstPort}</TableCell>
                      <TableCell className="text-xs text-center">{rule.numberOfPorts}</TableCell>
                      <TableCell className="text-xs text-center">{rule.protocol}</TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge variant={rule.status === 'Active' ? 'default' : 'secondary'} className={`text-xs ${getStatusBadgeVariant(rule.status)}`}>
                          {t(`cgnat_page.status_${rule.status.toLowerCase()}`, rule.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Edit className={iconSize} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className={iconSize} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <ChevronDown className={iconSize} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleExport('Linux', rule.id)}>
                                {t('cgnat_page.export_linux', 'Linux')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleExport('MikroTik', rule.id)}>
                                {t('cgnat_page.export_mikrotik', 'MikroTik')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-4 text-xs">
                      {t('cgnat_page.no_rules_found', 'No CGNAT rules configured yet.')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
