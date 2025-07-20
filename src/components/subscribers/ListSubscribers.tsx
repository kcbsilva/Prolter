// src/components/subscribers/ListSubscribers.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TableRow, TableCell } from '@/components/ui/table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Subscriber } from '@/types/subscribers';
import { SubscriberProfile } from './SubscriberProfile';
import { UpdateSubscriberModal } from './UpdateSubscriberModal';
import { RemoveSubscriberModal } from './RemoveSubscriberModal';
import { PaginatedSkeletonTable } from '@/components/ui/paginated-skeleton-table';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Props {
  subscribers?: Subscriber[];
  loading: boolean;
  refetch: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ListSubscribers({
  subscribers = [],
  loading,
  refetch,
  page,
  totalPages,
  onPageChange,
}: Props) {
  const [viewing, setViewing] = React.useState<Subscriber | null>(null);
  const [editing, setEditing] = React.useState<Subscriber | null>(null);
  const [removing, setRemoving] = React.useState<Subscriber | null>(null);
  const [selected, setSelected] = React.useState<string[]>([]);

  const iconSize = 'h-4 w-4';

  const toggleSelected = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <PaginatedSkeletonTable
        columns={[
          { key: 'select', label: '', className: 'w-4' },
          { key: 'id', label: 'ID', className: 'text-xs w-8' },
          { key: 'status', label: 'Status', className: 'text-xs' },
          { key: 'name', label: 'Name / Business', className: 'text-xs' },
          { key: 'tax', label: 'Tax ID / Business Number', className: 'text-xs' },
          { key: 'address', label: 'Address', className: 'text-xs' },
          { key: 'phone', label: 'Phone Number', className: 'text-xs' },
          { key: 'actions', label: 'Actions', className: 'text-xs text-right w-28' },
        ]}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onRefresh={refetch}
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <TableRow key={idx}>
              {[...Array(7)].map((_, col) => (
                <TableCell key={col}>
                  <Skeleton className="h-4 w-full max-w-[150px]" />
                </TableCell>
              ))}
              <TableCell className="text-right">
                <Skeleton className="h-4 w-20 ml-auto" />
              </TableCell>
            </TableRow>
          ))
        ) : subscribers.length > 0 ? (
          subscribers.map((subscriber, idx) => (
            <TableRow key={subscriber.id}>
              <TableCell>
                <Checkbox
                  checked={selected.includes(subscriber.id)}
                  onCheckedChange={() => toggleSelected(subscriber.id)}
                />
              </TableCell>

              <TableCell>{idx + 1}</TableCell>

              <TableCell>
                <span
                  className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
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

              <TableCell>
                {subscriber.subscriberType === 'Residential'
                  ? subscriber.fullName
                  : subscriber.companyName}
              </TableCell>

              <TableCell>
                {subscriber.subscriberType === 'Residential'
                  ? subscriber.taxId || '—'
                  : subscriber.businessNumber || '—'}
              </TableCell>

              <TableCell>{subscriber.address}</TableCell>

              <TableCell>{subscriber.phoneNumber}</TableCell>

              <TableCell className="text-right space-x-1">
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
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-muted-foreground py-8 text-xs">
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
