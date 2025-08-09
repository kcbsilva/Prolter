// src/app/settings/network/ip/page.tsx

'use client';

import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogTrigger, Dialog as _D, // alias to keep types imported for children
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useLocale } from '@/contexts/LocaleContext';
import {
  PlusCircle, Code, Search, Loader2, Filter,
} from 'lucide-react';

import { Th, Td } from '@/components/pages/settings/network/ip/_components/TableCells';
import { StatusBadge } from '@/components/pages/settings/network/ip/_components/StatusBadge';
import { StatCard } from '@/components/pages/settings/network/ip/_components/StatCard';
import { RowActions } from '@/components/pages/settings/network/ip/_components/RowActions';
import CreateOrEditBlockDialog from '@/components/pages/settings/network/ip/_components/CreateOrEditBlockDialog';
import { EmptyState } from '@/components/pages/settings/network/ip/_components/EmptyState';

import {
  IPBlock, IPBlockStatus, IPVersion, createBlockSchema,
} from '@/components/pages/settings/network/ip/_lib/types';
import { formatDate, fuzzyIncludes } from '@/components/pages/settings/network/ip/_lib/utils';

export default function NetworkIPs() {
  const { t } = useLocale();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState<IPBlock[]>([]);

  const [query, setQuery] = useState('');
  const [versionFilter, setVersionFilter] = useState<IPVersion | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<IPBlockStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<IPBlock | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBlocks([
        {
          id: '1', version: 'IPv4', cidr: '10.0.0.0/24',
          description: 'Private LAN range', status: 'active',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2', version: 'IPv6', cidr: '2001:db8::/48',
          description: 'Documentation block example', status: 'reserved',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return blocks
      .filter((b) => (versionFilter === 'all' ? true : b.version === versionFilter))
      .filter((b) => (statusFilter === 'all' ? true : b.status === statusFilter))
      .filter((b) =>
        query ? fuzzyIncludes(b.cidr, query) || fuzzyIncludes(b.description ?? '', query) : true
      );
  }, [blocks, versionFilter, statusFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  async function createBlock(data: { version: IPVersion; cidr: string; description?: string; status: IPBlockStatus }) {
    const now = new Date().toISOString();
    const newBlock: IPBlock = {
      id: crypto.randomUUID(),
      version: data.version,
      cidr: data.cidr,
      description: data.description,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };
    setBlocks((prev) => [newBlock, ...prev]);
    toast({ title: t('network_ip_page.toast_created', 'IP block created') });
  }

  async function updateBlock(id: string, patch: Partial<IPBlock>) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch, updatedAt: new Date().toISOString() } : b))
    );
    toast({ title: t('network_ip_page.toast_updated', 'IP block updated') });
  }

  async function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    toast({ title: t('network_ip_page.toast_removed', 'IP block removed') });
  }

  useEffect(() => {
    setPage(1);
  }, [query, versionFilter, statusFilter]);

  const iconSize = 'h-4 w-4';

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Code className={cn(iconSize, 'text-primary')} />
          <h1 className="text-lg font-semibold">
            {t('sidebar.network_ip', 'IPv4/IPv6 Management')}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className={cn('absolute left-2 top-1/2 -translate-y-1/2', 'h-4 w-4 text-muted-foreground')} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('common.search', 'Search by CIDR or description')}
              className="pl-8 w-[220px]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {t('common.filters', 'Filters')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <Label className="text-xs">{t('network_ip_page.version', 'Version')}</Label>
                <div className="mt-1 flex gap-1">
                  {(['all', 'IPv4', 'IPv6'] as const).map((v) => (
                    <Button
                      key={v}
                      size="sm"
                      variant={versionFilter === v ? 'default' : 'secondary'}
                      onClick={() => setVersionFilter(v as any)}
                      className="h-7"
                    >
                      {v}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="px-2 py-1.5">
                <Label className="text-xs">{t('network_ip_page.status', 'Status')}</Label>
                <div className="mt-1 flex gap-1 flex-wrap">
                  {(['all', 'active', 'reserved', 'deprecated'] as const).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={statusFilter === s ? 'default' : 'secondary'}
                      onClick={() => setStatusFilter(s as any)}
                      className="h-7"
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <PlusCircle className={cn('mr-2', iconSize)} />
                {t('network_ip_page.add_ip_block_button', 'Add IP Block')}
              </Button>
            </DialogTrigger>
            <CreateOrEditBlockDialog
              title={t('network_ip_page.add_ip_block_button', 'Add IP Block')}
              onSubmit={async (values) => {
                await createBlock(values);
                setCreateOpen(false);
              }}
            />
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label={t('network_ip_page.total_blocks', 'Total Blocks')} value={blocks.length} />
        <StatCard label={t('network_ip_page.total_ipv4', 'IPv4 Blocks')} value={blocks.filter((b) => b.version === 'IPv4').length} />
        <StatCard label={t('network_ip_page.total_ipv6', 'IPv6 Blocks')} value={blocks.filter((b) => b.version === 'IPv6').length} />
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            {t('network_ip_page.existing_blocks_title', 'Existing IP Blocks')}
          </CardTitle>
          <CardDescription className="text-xs">
            {t('network_ip_page.existing_blocks_description', 'Manage your allocated IPv4 and IPv6 address blocks.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('common.loading', 'Loading...')}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onAdd={() => setCreateOpen(true)} />
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <div className="max-h-[52vh] overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/60 backdrop-blur supports-[backdrop-filter]:bg-muted/40">
                    <tr className="text-left">
                      <Th>{t('network_ip_page.version', 'Version')}</Th>
                      <Th>CIDR</Th>
                      <Th>{t('common.description', 'Description')}</Th>
                      <Th>{t('common.status', 'Status')}</Th>
                      <Th>{t('common.updated', 'Updated')}</Th>
                      <Th className="text-right">{t('common.actions', 'Actions')}</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.map((b) => (
                      <tr key={b.id} className="border-t hover:bg-muted/30">
                        <Td>
                          <Badge variant={b.version === 'IPv4' ? 'default' : 'secondary'}>{b.version}</Badge>
                        </Td>
                        <Td className="font-medium">{b.cidr}</Td>
                        <Td className="truncate max-w-[260px]" title={b.description}>
                          {b.description || '-'}
                        </Td>
                        <Td><StatusBadge status={b.status} /></Td>
                        <Td className="text-muted-foreground">{formatDate(b.updatedAt)}</Td>
                        <Td className="text-right">
                          <RowActions onEdit={() => setEditing(b)} onDelete={() => removeBlock(b.id)} />
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-2">
                <div className="text-xs text-muted-foreground">
                  {t('common.showing', 'Showing')} {(page - 1) * pageSize + 1}–
                  {Math.min(page * pageSize, filtered.length)} {t('common.of', 'of')} {filtered.length}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    {t('common.prev', 'Prev')}
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button key={p} size="sm" variant={p === page ? 'default' : 'outline'} onClick={() => setPage(p)} className="w-9">
                      {p}
                    </Button>
                  ))}
                  <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                    {t('common.next', 'Next')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <_D open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && (
          <CreateOrEditBlockDialog
            title={t('network_ip_page.edit_ip_block_button', 'Edit IP Block')}
            defaultValues={editing}
            onSubmit={async (values) => {
              await updateBlock(editing.id, values as any);
              setEditing(null);
            }}
          />
        )}
      </_D>
    </div>
  );
}
