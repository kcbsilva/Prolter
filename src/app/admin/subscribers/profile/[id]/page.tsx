// src/app/subscribers/profile/[id]/page.tsx
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { cn } from '@/lib/utils';
import { User, Building, DollarSign, FileSignature, Server as ServerIcon, Wrench, Package as PackageIcon, FileText, ClipboardList, History as HistoryIcon, ListFilter as ListFilterIcon, CheckCircle, XCircle, Clock, CalendarClock, Handshake } from 'lucide-react';
import type { Subscriber, SubscriberStatus, ServiceStatus, SubscriberService, Invoice, PaymentPlan, PromiseToPay } from '@/types/subscribers'

// Tabs
import { InformationTab } from '@/components/pages/subscribers/profile/InformationTab';
import { ServicesTab } from '@/components/pages/subscribers/profile/ServicesTab';
import { BillingTab } from '@/components/pages/subscribers/profile/BillingTab';
import { ServiceCallsTab } from '@/components/pages/subscribers/profile/ServiceCallsTab';
import { InventoryTab } from '@/components/pages/subscribers/profile/InventoryTab';
import { DocumentsTab } from '@/components/pages/subscribers/profile/DocumentsTab';
import { NotesTab } from '@/components/pages/subscribers/profile/NotesTab';
import { HistoryTab } from '@/components/pages/subscribers/profile/HistoryTab';

// ---- helpers you already had ----
const getStatusBadgeVariant = (status: SubscriberStatus | ServiceStatus | undefined) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Suspended': return 'bg-yellow-100 text-yellow-800';
    case 'Inactive':
    case 'Canceled':
    case 'Planned': return 'bg-gray-100 text-gray-800';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

// Mock data loader (replace with real fetch)
const getSubscriberData = (id: string | undefined): Subscriber | null => {
  if (!id) return null;

  const base: Subscriber = {
    id: id, // keep as string
    subscriberType: 'Residential',
    fullName: 'Alice Wonderland',
    address: '123 Fantasy Lane',
    email: 'alice@example.com',
    phoneNumber: '555-1111',
    mobileNumber: '555-1010',
    signupDate: new Date(),
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
    services: [
      { id: 'svc-1', type: 'Internet', plan: 'Fiber 100', popId: 'pop-1', status: 'Active', technology: 'Fiber', downloadSpeed: '100 Mbps', uploadSpeed: '50 Mbps', ipAddress: '203.0.113.10', onlineStatus: 'Online', authenticationType: 'PPPoE', pppoeUsername: 'alice@isp.com', pppoePassword: 'password', xponSn: 'HWTC12345678' },
    ],
    billing: {
      balance: 0,
      nextBillDate: '',
      pastInvoices: [],
      pendingInvoices: [
        { id: 'inv-1', contractId: 'CTR-001', dateMade: '2025-08-01', dueDate: '2025-08-15', value: 50.00, wallet: 'VISA **** 1234', status: 'Due' },
      ],
      canceledInvoices: [],
      paymentPlans: [],
      promisesToPay: [],
    },
    serviceCalls: [],
    inventory: [],
    documents: [],
    notes: [],
    history: [],
  };

  if (id === '2') {
    base.id = '2';
    base.subscriberType = 'Commercial';
    base.fullName = undefined;
    base.companyName = 'Bob The Builder Inc.';
    base.status = 'Suspended';
  }

  return base;
};

export default function SubscriberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const subscriber = React.useMemo(() => getSubscriberData(id), [id]);

  const { t } = useLocale();
  const { toast } = useToast();

  if (!subscriber) {
    return <div className="p-6 text-sm text-muted-foreground">Subscriber not found.</div>;
  }

  // Billing badge count for tab
  const pendingDue = subscriber.billing?.pendingInvoices?.filter(i => i.status === 'Due') ?? [];
  const pendingInvoiceCount = pendingDue.length;

  const handleEdit = () =>
    toast({ title: t('subscriber_profile.edit_toast_title'), description: t('subscriber_profile.edit_toast_description') });

  const handleDelete = () =>
    toast({ title: t('subscriber_profile.delete_toast_title'), description: t('subscriber_profile.delete_toast_description'), variant: 'destructive' });

  return (
    <div className="flex flex-col gap-6 p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {subscriber.subscriberType === 'Residential' ? (
              <User className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Building className="h-4 w-4 text-muted-foreground" />
            )}
            <CardTitle className="text-base">
              {subscriber.subscriberType === 'Residential' ? subscriber.fullName : subscriber.companyName} (ID: {subscriber.id})
            </CardTitle>
            <Badge className={cn("text-xs ml-2", getStatusBadgeVariant(subscriber.status))}>
              {subscriber.status}
            </Badge>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>{t('subscriber_profile.edit_button')}</Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>{t('subscriber_profile.delete_button')}</Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 md:grid-cols-9">
          <TabsTrigger value="overview"><User className="mr-1.5 h-3 w-3" />{t('subscriber_profile.overview_tab')}</TabsTrigger>
          <TabsTrigger value="contracts"><FileSignature className="mr-1.5 h-3 w-3" />{t('subscriber_profile.contracts_tab')}</TabsTrigger>
          <TabsTrigger value="services"><ServerIcon className="mr-1.5 h-3 w-3" />{t('subscriber_profile.services_tab')}</TabsTrigger>
          <TabsTrigger value="billing" className="relative flex items-center justify-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>{t('subscriber_profile.billing_tab')}</span>
            {pendingInvoiceCount > 0 && (
              <span className="absolute -top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white bg-primary">
                {pendingInvoiceCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="service-calls"><Wrench className="mr-1.5 h-3 w-3" />{t('subscriber_profile.service_calls_tab')}</TabsTrigger>
          <TabsTrigger value="inventory"><PackageIcon className="mr-1.5 h-3 w-3" />{t('subscriber_profile.inventory_tab')}</TabsTrigger>
          <TabsTrigger value="documents"><FileText className="mr-1.5 h-3 w-3" />{t('subscriber_profile.documents_tab')}</TabsTrigger>
          <TabsTrigger value="notes"><ClipboardList className="mr-1.5 h-3 w-3" />{t('subscriber_profile.notes_tab')}</TabsTrigger>
          <TabsTrigger value="history"><HistoryIcon className="mr-1.5 h-3 w-3" />{t('subscriber_profile.history_tab')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <InformationTab subscriber={subscriber} />
        </TabsContent>

        <TabsContent value="contracts">
          {/* fill later */}
          <div className="text-xs text-muted-foreground p-6">No contracts yet.</div>
        </TabsContent>

        <TabsContent value="services">
          <ServicesTab subscriber={subscriber} />
        </TabsContent>

        <TabsContent value="billing">
          <BillingTab subscriber={subscriber} />
        </TabsContent>

        <TabsContent value="service-calls">
          <ServiceCallsTab />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryTab />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab />
        </TabsContent>

        <TabsContent value="notes">
          <NotesTab />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
