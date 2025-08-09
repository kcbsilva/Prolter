// src/components/subscribers/ListSubscribers.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TableRow, TableCell } from '@/components/ui/table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Subscriber } from '@/types/subscribers';
import { SubscriberProfile } from './SubscriberProfile';
import { UpdateSubscriberModal } from './UpdateSubscriberModal';
import { RemoveSubscriberModal } from './RemoveSubscriberModal';
import { PaginatedSkeletonTable } from '@/components/ui/paginated-skeleton-table';
import { cn } from '@/lib/utils';

interface Props {
  subscribers?: Subscriber[];
  loading: boolean;
  refetch: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  perPage?: number;
}

const digitsOnly = (v?: string | null, max = 14) =>
  (v ?? '').replace(/\D/g, '').slice(0, max);

export function ListSubscribers({
  subscribers = [],
  loading,
  refetch,
  page,
  totalPages,
  onPageChange,
  perPage = 10,
}: Props) {
  const [viewing, setViewing] = React.useState<Subscriber | null>(null);
  const [editing, setEditing] = React.useState<Subscriber | null>(null);
  const [removing, setRemoving] = React.useState<Subscriber | null>(null);

  const iconSize = 'h-4 w-4';

  return (
    <div className="flex flex-col gap-4">
      <PaginatedSkeletonTable
        columns={[
          { key: 'id', label: 'ID', className: 'text-xs text-center w-[22ch]' },
          { key: 'status', label: 'Status', className: 'text-xs text-center w-[8rem]' },
          { key: 'name', label: 'Name / Business', className: 'text-xs text-center min-w-[16rem]' },
          { key: 'tax', label: 'Tax ID / Business Number', className: 'text-xs text-center w-[16ch]' },
          { key: 'address', label: 'Address', className: 'text-xs text-center min-w-[28rem]' },
          { key: 'phone', label: 'Phone Number', className: 'text-xs text-center w-[16ch]' },
          { key: 'actions', label: 'Actions', className: 'text-xs text-center w-28' },
        ]}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onRefresh={refetch}
      >
        {loading ? (
          Array.from({ length: perPage }).map((_, idx) => (
            <TableRow key={`skeleton-${idx}`} className="animate-pulse">
              <TableCell className="text-center">
                <Skeleton className="h-4 w-[20ch] mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-[6rem] mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-[14rem] mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-[14ch] mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-[24rem] mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-[14ch] mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-6" />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : subscribers.length > 0 ? (
          subscribers.map((subscriber) => (
            <TableRow key={subscriber.id}>
              {/* UUID */}
              <TableCell className="text-center" title={subscriber.id}>
                <span className="font-mono text-xs truncate inline-block max-w-[22ch] align-middle">
                  {subscriber.id}
                </span>
              </TableCell>

              {/* Status with badge */}
              <TableCell className="text-center">
                <span
                  className={cn(
                    'inline-block text-xs font-medium px-2 py-0.5 rounded-full',
                    {
                      'bg-green-100 text-green-700': subscriber.status === 'Active',
                      'bg-orange-100 text-orange-700': subscriber.status === 'Suspended',
                      'bg-gray-100 text-gray-700': subscriber.status === 'Inactive',
                      'bg-yellow-100 text-yellow-700': subscriber.status === 'Planned',
                      'bg-red-100 text-red-700': subscriber.status === 'Canceled',
                    }
                  )}
                >
                  {subscriber.status}
                </span>
              </TableCell>

              {/* NAME / BUSINESS clickable, ALL CAPS */}
              <TableCell className="text-center uppercase">
                <Link
                  href={`/subscribers/profile/${subscriber.id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {subscriber.subscriberType === 'Residential'
                    ? (subscriber.fullName ?? '')
                    : (subscriber.companyName ?? '')}
                </Link>
              </TableCell>

              {/* Tax ID / Business Number (digits only) */}
              <TableCell className="text-center">
                <span className="font-mono tabular-nums text-xs">
                  {subscriber.subscriberType === 'Residential'
                    ? digitsOnly(subscriber.taxId)
                    : digitsOnly(subscriber.businessNumber)}
                </span>
              </TableCell>

              {/* Address */}
              <TableCell className="text-center truncate" title={subscriber.address}>
                {subscriber.address}
              </TableCell>

              {/* Phone */}
              <TableCell className="text-center">
                <span className="font-mono tabular-nums text-xs">
                  {subscriber.phoneNumber}
                </span>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setViewing(subscriber)}
                  >
                    <Eye className={iconSize} />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditing(subscriber)}
                  >
                    <Pencil className={iconSize} />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setRemoving(subscriber)}
                  >
                    <Trash2 className={iconSize} />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground py-8 text-xs">
              No subscribers found.
            </TableCell>
          </TableRow>
        )}
      </PaginatedSkeletonTable>

      {viewing && (
        <SubscriberProfile
          open={!!viewing}
          subscriber={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => {
            setEditing(viewing);
            setViewing(null);
          }}
          onDelete={() => {
            setRemoving(viewing);
            setViewing(null);
          }}
        />
      )}
      {editing && (
        <UpdateSubscriberModal
          subscriber={editing}
          onClose={() => setEditing(null)}
          onSuccess={refetch}
          open={!!editing}
        />
      )}
      {removing && (
        <RemoveSubscriberModal
          subscriberId={removing.id}
          onClose={() => setRemoving(null)}
          onSuccess={refetch}
          open={!!removing}
        />
      )}
    </div>
  );
}
