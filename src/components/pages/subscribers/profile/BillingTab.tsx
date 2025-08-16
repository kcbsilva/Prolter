// src/components/subscribers/profile/BillingTab.tsx
'use client';

import * as React from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { Card, CardContent } from '@/components/shared/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/shared/ui/tabs';
import { Button } from '@/components/shared/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/shared/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/ui/table';
import { Checkbox } from '@/components/shared/ui/checkbox';
import { CreditCard, FileX, Receipt, Printer, Send, ListFilter as ListFilterIcon, Clock, CheckCircle, XCircle, CalendarClock, Handshake, FilePlus2, ChevronDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr as frLocale, ptBR as ptBRLocale, enUS as enUSLocale } from 'date-fns/locale';
import type { Subscriber, Invoice, PaymentPlan, PromiseToPay } from '@/types/subscribers';

type BillingFilter = 'All' | 'Pending' | 'Paid' | 'Canceled' | 'PaymentPlan' | 'PromiseToPay';

const dateLocales = { en: enUSLocale, fr: frLocale, pt: ptBRLocale };

export const BillingTab: React.FC<{ subscriber: Subscriber }> = ({ subscriber }) => {
  const { t, locale } = useLocale();
  const [activeBillingTab, setActiveBillingTab] = React.useState<BillingFilter>('Pending');
  const [selectedPendingInvoices, setSelectedPendingInvoices] = React.useState<string[]>([]);

  const allItems: (Invoice | PaymentPlan | PromiseToPay & { itemType: string })[] = React.useMemo(() => {
    const items: any[] = [];
    (subscriber.billing.pendingInvoices || []).forEach(inv => items.push({ ...inv, itemType: 'invoice' }));
    (subscriber.billing.pastInvoices || []).forEach(inv => items.push({ ...inv, itemType: 'invoice' }));
    (subscriber.billing.canceledInvoices || []).forEach(inv => items.push({ ...inv, itemType: 'invoice' }));
    (subscriber.billing.paymentPlans || []).forEach(pp => items.push({ ...pp, itemType: 'paymentPlan' }));
    (subscriber.billing.promisesToPay || []).forEach(ptp => items.push({ ...ptp, itemType: 'promiseToPay' }));
    return items;
  }, [subscriber.billing]);

  const filtered = React.useMemo(() => {
    switch (activeBillingTab) {
      case 'All': return allItems;
      case 'Pending': return allItems.filter(i => i.itemType === 'invoice' && (i as Invoice).status === 'Due');
      case 'Paid': return allItems.filter(i => i.itemType === 'invoice' && (i as Invoice).status === 'Paid');
      case 'Canceled': return allItems.filter(i => i.itemType === 'invoice' && (i as Invoice).status === 'Canceled');
      case 'PaymentPlan': return allItems.filter(i => i.itemType === 'paymentPlan' && (i as PaymentPlan).status === 'Active');
      case 'PromiseToPay': return allItems.filter(i => i.itemType === 'promiseToPay' && (i as PromiseToPay).status === 'Pending');
      default: return [];
    }
  }, [allItems, activeBillingTab]);

  const isAllPendingSelected =
    (subscriber.billing.pendingInvoices?.filter(inv => inv.status === 'Due').length || 0) > 0 &&
    selectedPendingInvoices.length === (subscriber.billing.pendingInvoices?.filter(inv => inv.status === 'Due').length || 0);

  const selectAllPending = (checked: boolean) => {
    if (checked) {
      setSelectedPendingInvoices(subscriber.billing.pendingInvoices.filter(inv => inv.status === 'Due').map(inv => inv.id));
    } else {
      setSelectedPendingInvoices([]);
    }
  };

  const onSelectPending = (id: string, checked: boolean) =>
    setSelectedPendingInvoices(prev => checked ? [...prev, id] : prev.filter(x => x !== id));

  // Dummy handlers (replace with real)
  const makeInvoice = () => {};
  const makePaymentPlan = () => {};
  const makePromiseToPay = () => {};

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Tabs value={activeBillingTab} onValueChange={(v) => setActiveBillingTab(v as BillingFilter)} className="w-full">
          <TabsList className="grid w-full grid-cols-6 h-auto">
            <TabsTrigger value="All"><ListFilterIcon className="mr-1.5 h-3 w-3" />{t('subscriber_profile.billing_filter_all')}</TabsTrigger>
            <TabsTrigger value="Pending"><Clock className="mr-1.5 h-3 w-3" />{t('subscriber_profile.billing_filter_pending')}</TabsTrigger>
            <TabsTrigger value="Paid"><CheckCircle className="mr-1.5 h-3 w-3" />{t('subscriber_profile.billing_filter_paid')}</TabsTrigger>
            <TabsTrigger value="Canceled"><XCircle className="mr-1.5 h-3 w-3" />{t('subscriber_profile.billing_filter_canceled')}</TabsTrigger>
            <TabsTrigger value="PaymentPlan"><CalendarClock className="mr-1.5 h-3 w-3" />{t('subscriber_profile.billing_filter_payment_plan')}</TabsTrigger>
            <TabsTrigger value="PromiseToPay"><Handshake className="mr-1.5 h-3 w-3" />{t('subscriber_profile.billing_filter_promise_to_pay')}</TabsTrigger>
          </TabsList>
        </Tabs>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="ml-4">
              {t('subscriber_profile.billing_actions_button', 'Actions')} <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={makeInvoice}><FilePlus2 className="mr-2 h-3 w-3" />{t('subscriber_profile.billing_make_invoice_button')}</DropdownMenuItem>
            <DropdownMenuItem onClick={makePaymentPlan} disabled={activeBillingTab === 'Pending' && selectedPendingInvoices.length === 0}><CalendarClock className="mr-2 h-3 w-3" />{t('subscriber_profile.billing_make_payment_plan_button')}</DropdownMenuItem>
            <DropdownMenuItem onClick={makePromiseToPay} disabled={activeBillingTab === 'Pending' && selectedPendingInvoices.length === 0}><Handshake className="mr-2 h-3 w-3" />{t('subscriber_profile.billing_make_promise_to_pay_button')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardContent className="pt-6">
          {filtered.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 text-center">
                    {activeBillingTab === 'Pending' && (
                      <Checkbox checked={isAllPendingSelected} onCheckedChange={selectAllPending} aria-label="Select all" />
                    )}
                  </TableHead>
                  <TableHead className="text-center">{t('subscriber_profile.billing_header_contract_id')}</TableHead>
                  <TableHead className="text-center">{t('subscriber_profile.billing_header_date_made')}</TableHead>
                  <TableHead className="text-center">{t('subscriber_profile.billing_header_due_date')}</TableHead>
                  <TableHead className="text-center">{t('subscriber_profile.billing_header_value')}</TableHead>
                  <TableHead className="text-center">{t('subscriber_profile.billing_header_wallet')}</TableHead>
                  <TableHead className="text-center">{t('subscriber_profile.billing_header_actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      {item.itemType === 'invoice' && item.status === 'Due' && activeBillingTab === 'Pending' && (
                        <Checkbox
                          checked={selectedPendingInvoices.includes(item.id)}
                          onCheckedChange={(checked) => onSelectPending(item.id, !!checked)}
                          aria-label={`select ${item.id}`}
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-center">{(item as Invoice).contractId || '-'}</TableCell>
                    <TableCell className="text-xs text-center">
                      {item.itemType === 'invoice' && item.dateMade
                        ? format(parseISO(item.dateMade), 'PP', { locale: dateLocales[locale] || enUSLocale })
                        : item.itemType === 'paymentPlan' && item.startDate
                        ? format(parseISO(item.startDate), 'PP', { locale: dateLocales[locale] || enUSLocale })
                        : '-'}
                    </TableCell>
                    <TableCell className="text-xs text-center">
                      {item.itemType === 'invoice' && item.dueDate
                        ? format(parseISO(item.dueDate), 'PP', { locale: dateLocales[locale] || enUSLocale })
                        : item.itemType === 'promiseToPay' && item.promiseDate
                        ? format(parseISO(item.promiseDate), 'PP', { locale: dateLocales[locale] || enUSLocale })
                        : '-'}
                    </TableCell>
                    <TableCell className="text-xs text-center">
                      {item.itemType === 'invoice'
                        ? item.value.toFixed(2)
                        : item.itemType === 'paymentPlan'
                        ? `${item.installments}x ${item.installmentAmount.toFixed(2)}`
                        : item.itemType === 'promiseToPay'
                        ? item.amount.toFixed(2)
                        : '-'}
                    </TableCell>
                    <TableCell className="text-xs text-center">{(item as Invoice).wallet || '-'}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">⋯</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><CreditCard className="mr-2 h-3 w-3" />{t('subscriber_profile.billing_action_receive_payment')}</DropdownMenuItem>
                          <DropdownMenuItem><FileX className="mr-2 h-3 w-3" />{t('subscriber_profile.billing_action_remove_payment')}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem><Receipt className="mr-2 h-3 w-3" />{t('subscriber_profile.billing_action_detailed_invoice')}</DropdownMenuItem>
                          <DropdownMenuItem><Printer className="mr-2 h-3 w-3" />{t('subscriber_profile.billing_action_print_pdf')}</DropdownMenuItem>
                          <DropdownMenuItem><Send className="mr-2 h-3 w-3" />{t('subscriber_profile.billing_action_send_email')}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              {activeBillingTab === 'All' && t('subscriber_profile.billing_no_invoices')}
              {activeBillingTab === 'Pending' && t('subscriber_profile.billing_no_pending_invoices')}
              {activeBillingTab === 'Paid' && t('subscriber_profile.billing_no_paid_invoices')}
              {activeBillingTab === 'Canceled' && t('subscriber_profile.billing_no_canceled_invoices')}
              {activeBillingTab === 'PaymentPlan' && t('subscriber_profile.billing_no_payment_plans')}
              {activeBillingTab === 'PromiseToPay' && t('subscriber_profile.billing_no_promises_to_pay')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
