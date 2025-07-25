
// src/app/admin/settings/plans/internet/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Wifi, ArrowUp, ArrowDown, DollarSign, Hash, Users, Building, RefreshCw, Search, ChevronDown } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Pop {
  id: string;
  name: string;
}

const mockPops: Pop[] = [
  { id: 'pop-1', name: 'Central Hub' },
  { id: 'pop-2', name: 'North Branch POP' },
  { id: 'pop-3', name: 'Southside Tower' },
];

interface InternetPlan {
  id: string;
  name: string;
  uploadSpeed: string; // Display string e.g., "50 Mbps"
  downloadSpeed: string; // Display string e.g., "100 Mbps"
  price: string; // Display string e.g., "$59.99/mo"
  uploadSpeedValue: number; // Numeric value in Mbps
  downloadSpeedValue: number; // Numeric value in Mbps
  priceValue: number; // Numeric value
  connectionType: 'Fiber' | 'Radio' | 'Satellite' | 'UTP';
  clientCount: number;
  popId: string;
}

const placeholderPlans: InternetPlan[] = [
  {
    id: 'plan-1',
    name: 'Basic Fiber 50',
    uploadSpeed: '50 Mbps',
    downloadSpeed: '50 Mbps',
    price: '$39.99/mo',
    uploadSpeedValue: 50,
    downloadSpeedValue: 50,
    priceValue: 39.99,
    connectionType: 'Fiber',
    clientCount: 120,
    popId: 'pop-1',
  },
  {
    id: 'plan-2',
    name: 'Pro Radio 100',
    uploadSpeed: '25 Mbps',
    downloadSpeed: '100 Mbps',
    price: '$59.99/mo',
    uploadSpeedValue: 25,
    downloadSpeedValue: 100,
    priceValue: 59.99,
    connectionType: 'Radio',
    clientCount: 75,
    popId: 'pop-2',
  },
  {
    id: 'plan-3',
    name: 'Ultimate Fiber 1G',
    uploadSpeed: '1 Gbps',
    downloadSpeed: '1 Gbps',
    price: '$99.99/mo',
    uploadSpeedValue: 1000,
    downloadSpeedValue: 1000,
    priceValue: 99.99,
    connectionType: 'Fiber',
    clientCount: 250,
    popId: 'pop-1',
  },
  {
    id: 'plan-4',
    name: 'Starter UTP 200',
    uploadSpeed: '200 Mbps',
    downloadSpeed: '200 Mbps',
    price: '$49.99/mo',
    uploadSpeedValue: 200,
    downloadSpeedValue: 200,
    priceValue: 49.99,
    connectionType: 'UTP',
    clientCount: 50,
    popId: 'pop-3',
  },
];

type SpeedFilter = 'all' | 'lte100' | 'gt100';
type PriceSortOrder = 'none' | 'asc' | 'desc';
type ConnectionTypeFilter = 'All' | InternetPlan['connectionType'];

const planSchema = z.object({
  name: z.string().min(1, 'Required'),
  popId: z.string().min(1, 'Required'),
  uploadSpeedValue: z.coerce.number().positive(),
  downloadSpeedValue: z.coerce.number().positive(),
  priceValue: z.coerce.number().nonnegative(),
  connectionType: z.enum(['Fiber', 'Radio', 'Satellite', 'UTP']),
});

type PlanFormData = z.infer<typeof planSchema>;

export default function PlansInternet() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";
  const titleIconSize = "h-4 w-4";
  const columnHeaderIconSize = "h-2.5 w-2.5";

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPop, setSelectedPop] = React.useState<string>('all');
  const [selectedSpeed, setSelectedSpeed] = React.useState<SpeedFilter>('all');
  const [selectedConnectionType, setSelectedConnectionType] = React.useState<ConnectionTypeFilter>('All');
  const [priceSortOrder, setPriceSortOrder] = React.useState<PriceSortOrder>('none');
  const [currentPlans, setCurrentPlans] = React.useState<InternetPlan[]>(placeholderPlans);
  const [isAddPlanDialogOpen, setIsAddPlanDialogOpen] = React.useState(false);

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      popId: '',
      uploadSpeedValue: 0,
      downloadSpeedValue: 0,
      priceValue: 0,
      connectionType: 'Fiber',
    },
  });

  const handleAddPlanSubmit = (data: PlanFormData) => {
    const newPlan: InternetPlan = {
      id: `plan-${Date.now()}`,
      name: data.name,
      uploadSpeed: data.uploadSpeedValue >= 1000 ? `${data.uploadSpeedValue / 1000} Gbps` : `${data.uploadSpeedValue} Mbps`,
      downloadSpeed: data.downloadSpeedValue >= 1000 ? `${data.downloadSpeedValue / 1000} Gbps` : `${data.downloadSpeedValue} Mbps`,
      price: `$${data.priceValue.toFixed(2)}/mo`,
      uploadSpeedValue: data.uploadSpeedValue,
      downloadSpeedValue: data.downloadSpeedValue,
      priceValue: data.priceValue,
      connectionType: data.connectionType,
      clientCount: 0,
      popId: data.popId,
    };
    setCurrentPlans(prev => [newPlan, ...prev]);
    toast({
      title: t('internet_plans_add_success_title', 'Plan Added'),
      description: t('internet_plans_add_success_description', 'Plan "{name}" added.').replace('{name}', data.name),
    });
    form.reset();
    setIsAddPlanDialogOpen(false);
  };
  
  const handleRefresh = () => {
    setCurrentPlans(placeholderPlans);
    setSearchTerm('');
    setSelectedPop('all');
    setSelectedSpeed('all');
    setSelectedConnectionType('All');
    setPriceSortOrder('none');
    toast({ title: t('refresh_button'), description: t('refresh_button') });
  };

  const filteredAndSortedPlans = React.useMemo(() => {
    let plans = [...currentPlans];

    if (searchTerm) {
      plans = plans.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mockPops.find(p => p.id === plan.popId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedPop !== 'all') {
      plans = plans.filter(plan => plan.popId === selectedPop);
    }

    if (selectedSpeed === 'lte100') {
      plans = plans.filter(plan => plan.downloadSpeedValue <= 100);
    } else if (selectedSpeed === 'gt100') {
      plans = plans.filter(plan => plan.downloadSpeedValue > 100);
    }

    if (selectedConnectionType !== 'All') {
      plans = plans.filter(plan => plan.connectionType === selectedConnectionType);
    }

    if (priceSortOrder === 'asc') {
      plans.sort((a, b) => a.priceValue - b.priceValue);
    } else if (priceSortOrder === 'desc') {
      plans.sort((a, b) => b.priceValue - a.priceValue);
    }

    return plans;
  }, [currentPlans, searchTerm, selectedPop, selectedSpeed, selectedConnectionType, priceSortOrder]);


  const getConnectionTypeBadgeVariant = (type: InternetPlan['connectionType']) => {
    switch (type) {
      case 'Fiber': return 'default';
      case 'Radio': return 'secondary';
      case 'Satellite': return 'outline';
      case 'UTP': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Wifi className={`${titleIconSize} text-primary`} />
          {t('internet_plans_page_title')}
        </h1>
        <div className="flex items-center gap-2">
            <Button onClick={handleRefresh} variant="outline" className="shrink-0">
                <RefreshCw className={`mr-2 ${iconSize}`} /> {t('refresh_button')}
            </Button>
            <Dialog open={isAddPlanDialogOpen} onOpenChange={setIsAddPlanDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white shrink-0">
                  <PlusCircle className={`mr-2 ${iconSize}`} /> {t('internet_plans_add_button')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('internet_plans_add_dialog_title', 'Add Internet Plan')}</DialogTitle>
                  <DialogDescription>{t('internet_plans_add_dialog_description', 'Fill in the details for the new plan.')}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddPlanSubmit)} className="grid gap-4 py-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('internet_plans_form_name_label', 'Plan Name')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="popId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('internet_plans_form_pop_label', 'POP')}</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('internet_plans_form_pop_label', 'POP')} />
                            </SelectTrigger>
                            <SelectContent>
                              {mockPops.map(pop => (
                                <SelectItem key={pop.id} value={pop.id}>{pop.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="uploadSpeedValue" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('internet_plans_form_upload_label', 'Upload Speed (Mbps)')}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="downloadSpeedValue" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('internet_plans_form_download_label', 'Download Speed (Mbps)')}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="priceValue" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('internet_plans_form_price_label', 'Monthly Price ($)')}</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="connectionType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('internet_plans_form_connection_type_label', 'Connection Type')}</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('internet_plans_form_connection_type_label', 'Connection Type')} />
                            </SelectTrigger>
                            <SelectContent>
                              {(['Fiber','Radio','Satellite','UTP'] as const).map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>{t('internet_plans_form_cancel_button', 'Cancel')}</Button>
                      </DialogClose>
                      <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? t('internet_plans_form_saving_button', 'Saving...') : t('internet_plans_form_save_button', 'Save Plan')}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <div className="relative flex-grow w-full sm:w-auto">
            <Search className={`absolute left-2.5 top-2.5 ${iconSize} text-muted-foreground`} />
            <Input
            type="search"
            placeholder={t('search')}
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0 w-full sm:w-auto">
                    {t('internet_plans_filter_pop_label')}: {selectedPop === 'all' ? t('internet_plans_filter_all_label') : mockPops.find(p=>p.id === selectedPop)?.name || 'Unknown'}
                    <ChevronDown className={`ml-2 ${iconSize}`} />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem checked={selectedPop === 'all'} onCheckedChange={() => setSelectedPop('all')}>
                    {t('internet_plans_filter_all_label')}
                </DropdownMenuCheckboxItem>
                {mockPops.map(pop => (
                    <DropdownMenuCheckboxItem key={pop.id} checked={selectedPop === pop.id} onCheckedChange={() => setSelectedPop(pop.id)}>
                    {pop.name}
                    </DropdownMenuCheckboxItem>
                ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0 w-full sm:w-auto">
                    {t('internet_plans_filter_speed_label')}: {
                    selectedSpeed === 'all' ? t('internet_plans_filter_all_label') :
                    selectedSpeed === 'lte100' ? t('internet_plans_speed_lte100') :
                    t('internet_plans_speed_gt100')
                    }
                    <ChevronDown className={`ml-2 ${iconSize}`} />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem checked={selectedSpeed === 'all'} onCheckedChange={() => setSelectedSpeed('all')}>{t('internet_plans_filter_all_label')}</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={selectedSpeed === 'lte100'} onCheckedChange={() => setSelectedSpeed('lte100')}>{t('internet_plans_speed_lte100')}</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={selectedSpeed === 'gt100'} onCheckedChange={() => setSelectedSpeed('gt100')}>{t('internet_plans_speed_gt100')}</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0 w-full sm:w-auto">
                     {t('internet_plans_filter_connection_type_label')}: {selectedConnectionType === 'All' ? t('internet_plans_filter_all_label') : t(`internet_plans_connection_type_${selectedConnectionType.toLowerCase()}` as any, selectedConnectionType)}
                    <ChevronDown className={`ml-2 ${iconSize}`} />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem checked={selectedConnectionType === 'All'} onCheckedChange={() => setSelectedConnectionType('All')}>{t('internet_plans_filter_all_label')}</DropdownMenuCheckboxItem>
                    {(['Fiber', 'Radio', 'Satellite', 'UTP'] as const).map(type => (
                        <DropdownMenuCheckboxItem key={type} checked={selectedConnectionType === type} onCheckedChange={() => setSelectedConnectionType(type)}>
                        {t(`internet_plans_connection_type_${type.toLowerCase()}` as any, type)}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0 w-full sm:w-auto">
                    {t('internet_plans_sort_price_label')}: {
                    priceSortOrder === 'none' ? t('internet_plans_sort_price_default') :
                    priceSortOrder === 'asc' ? t('internet_plans_sort_price_asc') :
                    t('internet_plans_sort_price_desc')
                    }
                    <ChevronDown className={`ml-2 ${iconSize}`} />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setPriceSortOrder('none')}>{t('internet_plans_sort_price_default')}</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setPriceSortOrder('asc')}>{t('internet_plans_sort_price_asc')}</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setPriceSortOrder('desc')}>{t('internet_plans_sort_price_desc')}</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {filteredAndSortedPlans.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24 text-xs text-center font-semibold">
                      <div className="flex items-center justify-center gap-1">
                        <Hash className={columnHeaderIconSize} />{t('internet_plans_table_header_id')}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      {t('internet_plans_table_header_name')}
                    </TableHead>
                    <TableHead className="text-xs text-center font-semibold">
                      <div className="flex items-center justify-center gap-1">
                        <Building className={columnHeaderIconSize} />{t('internet_plans_table_header_pop')}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs text-center font-semibold">
                      <div className="flex items-center justify-center gap-1">
                        <ArrowUp className={columnHeaderIconSize} />{t('internet_plans_table_header_upload')}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs text-center font-semibold">
                       <div className="flex items-center justify-center gap-1">
                        <ArrowDown className={columnHeaderIconSize} />{t('internet_plans_table_header_download')}
                       </div>
                    </TableHead>
                    <TableHead className="text-xs text-center font-semibold">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className={columnHeaderIconSize} />{t('internet_plans_table_header_price')}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs text-center font-semibold">
                      {t('internet_plans_table_header_connection_type')}
                    </TableHead>
                    <TableHead className="text-xs text-center font-semibold">
                       <div className="flex items-center justify-center gap-1">
                        <Users className={columnHeaderIconSize} />{t('internet_plans_table_header_client_count')}
                       </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedPlans.map((plan) => {
                    const popName = mockPops.find(p => p.id === plan.popId)?.name || 'N/A';
                    return (
                    <TableRow key={plan.id}>
                      <TableCell className="font-mono text-muted-foreground text-xs text-center">{plan.id}</TableCell>
                      <TableCell className="font-medium text-xs">
                        <Link href={`/admin/settings/plans/internet/${plan.id}`} className="hover:underline text-primary">
                          {plan.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs text-center">{popName}</TableCell>
                      <TableCell className="text-xs text-center">{plan.uploadSpeed}</TableCell>
                      <TableCell className="text-xs text-center">{plan.downloadSpeed}</TableCell>
                      <TableCell className="text-xs text-center">{plan.price}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getConnectionTypeBadgeVariant(plan.connectionType)} className="text-xs">
                          {t(`internet_plans_connection_type_${plan.connectionType.toLowerCase()}` as any, plan.connectionType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {plan.clientCount}
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4 text-xs">
              {searchTerm || selectedPop !== 'all' || selectedSpeed !== 'all' || selectedConnectionType !== 'All'
                ? t('internet_plans_no_plans_match_filters')
                : t('internet_plans_no_plans_found_internet')
              }
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
