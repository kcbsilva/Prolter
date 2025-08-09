// src/app/subscribers/profile/[id]/page.tsx
// Server Component – loads subscriber from Postgres and renders tabs

import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  User, Building, DollarSign, FileSignature,
  Server as ServerIcon, Wrench, Package as PackageIcon,
  FileText, ClipboardList, History as HistoryIcon,
} from 'lucide-react';
import type { Subscriber, SubscriberStatus, ServiceStatus } from '@/types/subscribers';

// Tabs (your existing client components)
import { InformationTab } from '@/components/pages/subscribers/profile/InformationTab';
import { ServicesTab } from '@/components/pages/subscribers/profile/ServicesTab';
import { BillingTab } from '@/components/pages/subscribers/profile/BillingTab';
import { ServiceCallsTab } from '@/components/pages/subscribers/profile/ServiceCallsTab';
import { InventoryTab } from '@/components/pages/subscribers/profile/InventoryTab';
import { DocumentsTab } from '@/components/pages/subscribers/profile/DocumentsTab';
import { NotesTab } from '@/components/pages/subscribers/profile/NotesTab';
import { HistoryTab } from '@/components/pages/subscribers/profile/HistoryTab';

// Ensure Node runtime for 'pg'
export const runtime = 'nodejs';

type PageProps = { params: { id: string } };

const statusBadge = (status: SubscriberStatus | ServiceStatus | undefined) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Suspended': return 'bg-yellow-100 text-yellow-800';
    case 'Inactive':
    case 'Canceled':
    case 'Planned': return 'bg-gray-100 text-gray-800';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

// Map DB row → app type
function mapRowToSubscriber(row: any): Subscriber {
  return {
    // Prefer the UUID externally; fall back to integer id if needed
    id: row.public_id ?? row.id,
    subscriberType: row.subscriberType,
    fullName: row.fullName ?? undefined,
    companyName: row.companyName ?? undefined,
    birthday: row.birthday ?? undefined,
    establishedDate: row.establishedDate ?? undefined,
    address: row.address,
    pointOfReference: row.pointOfReference ?? undefined,
    email: row.email,
    phoneNumber: row.phoneNumber,
    mobileNumber: row.mobileNumber ?? undefined,
    taxId: row.taxId ?? undefined,
    businessNumber: row.businessNumber ?? undefined,
    idNumber: row.idNumber ?? undefined,
    signupDate: row.signupDate,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,

    // Fill these later with real queries
    services: [],
    billing: {
      balance: 0,
      nextBillDate: '',
      pastInvoices: [],
      pendingInvoices: [],
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
}

// Try UUID (public_id) first; if not, try integer id
async function loadSubscriber(idParam: string): Promise<Subscriber | null> {
  const byUuidSQL = `
    SELECT
      id,
      public_id,
      subscriber_type    AS "subscriberType",
      full_name          AS "fullName",
      company_name       AS "companyName",
      birthday,
      established_date   AS "establishedDate",
      address,
      point_of_reference AS "pointOfReference",
      email,
      phone_number       AS "phoneNumber",
      mobile_number      AS "mobileNumber",
      tax_id             AS "taxId",
      business_number    AS "businessNumber",
      id_number          AS "idNumber",
      signup_date        AS "signupDate",
      status,
      created_at         AS "createdAt",
      updated_at         AS "updatedAt"
    FROM subscribers
    WHERE public_id = $1::uuid
    LIMIT 1;
  `;

  const byIntSQL = `
    SELECT
      id,
      public_id,
      subscriber_type    AS "subscriberType",
      full_name          AS "fullName",
      company_name       AS "companyName",
      birthday,
      established_date   AS "establishedDate",
      address,
      point_of_reference AS "pointOfReference",
      email,
      phone_number       AS "phoneNumber",
      mobile_number      AS "mobileNumber",
      tax_id             AS "taxId",
      business_number    AS "businessNumber",
      id_number          AS "idNumber",
      signup_date        AS "signupDate",
      status,
      created_at         AS "createdAt",
      updated_at         AS "updatedAt"
    FROM subscribers
    WHERE id = $1::int
    LIMIT 1;
  `;

  const looksLikeUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idParam);

  if (looksLikeUuid) {
    const { rows } = await db.query(byUuidSQL, [idParam]);
    if (rows[0]) return mapRowToSubscriber(rows[0]);
  }

  if (/^\d+$/.test(idParam)) {
    const { rows } = await db.query(byIntSQL, [Number(idParam)]);
    if (rows[0]) return mapRowToSubscriber(rows[0]);
  }

  // one last attempt as UUID (in case pattern block was too strict)
  try {
    const { rows } = await db.query(byUuidSQL, [idParam]);
    if (rows[0]) return mapRowToSubscriber(rows[0]);
  } catch {
    // ignore
  }

  return null;
}

export default async function SubscriberProfilePage({ params }: PageProps) {
  const subscriber = await loadSubscriber(params.id);
  if (!subscriber) return notFound();

  const pendingInvoiceCount =
    subscriber.billing?.pendingInvoices?.filter(i => i.status === 'Due')?.length ?? 0;

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {subscriber.subscriberType === 'Residential'
              ? <User className="h-4 w-4 text-muted-foreground" />
              : <Building className="h-4 w-4 text-muted-foreground" />
            }
            <CardTitle className="text-base">
              {subscriber.subscriberType === 'Residential'
                ? subscriber.fullName
                : subscriber.companyName}{' '}
              (ID: {subscriber.id})
            </CardTitle>
            <Badge className={cn('text-xs ml-2', statusBadge(subscriber.status))}>
              {subscriber.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 md:grid-cols-9">
          <TabsTrigger value="overview"><User className="mr-1.5 h-3 w-3" />Overview</TabsTrigger>
          <TabsTrigger value="contracts"><FileSignature className="mr-1.5 h-3 w-3" />Contracts</TabsTrigger>
          <TabsTrigger value="services"><ServerIcon className="mr-1.5 h-3 w-3" />Services</TabsTrigger>
          <TabsTrigger value="billing" className="relative flex items-center justify-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>Billing</span>
            {pendingInvoiceCount > 0 && (
              <span className="absolute -top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white bg-primary">
                {pendingInvoiceCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="service-calls"><Wrench className="mr-1.5 h-3 w-3" />Service Calls</TabsTrigger>
          <TabsTrigger value="inventory"><PackageIcon className="mr-1.5 h-3 w-3" />Inventory</TabsTrigger>
          <TabsTrigger value="documents"><FileText className="mr-1.5 h-3 w-3" />Documents</TabsTrigger>
          <TabsTrigger value="notes"><ClipboardList className="mr-1.5 h-3 w-3" />Notes</TabsTrigger>
          <TabsTrigger value="history"><HistoryIcon className="mr-1.5 h-3 w-3" />History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <InformationTab subscriber={subscriber} />
        </TabsContent>

        {/* These will show but currently receive only base subscriber (services/billing are empty).
           Add real queries and pass data when you're ready. */}
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
