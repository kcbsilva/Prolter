// src/app/settings/network/ip/page.tsx
'use client'

import * as React from 'react'
import { useMemo, useState, useEffect } from 'react'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useLocale } from '@/contexts/LocaleContext'
import {
  PlusCircle,
  Code,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Info,
  Filter,
} from 'lucide-react'

// -------------------------- Types & Schemas --------------------------

export type IPVersion = 'IPv4' | 'IPv6'

export type IPBlockStatus = 'active' | 'reserved' | 'deprecated'

export interface IPBlock {
  id: string
  version: IPVersion
  cidr: string // e.g., "192.168.0.0/24" or "2001:db8::/32"
  description?: string
  status: IPBlockStatus
  createdAt: string // ISO date
  updatedAt: string // ISO date
}

// Basic CIDR validators (not exhaustively strict, but practical)
const ipv4CidrRegex = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)(\.(25[0-5]|2[0-4]\d|[01]?\d\d?)){3}\/(3[0-2]|[12]?\d)$/
const ipv6CidrRegex = /^[0-9a-fA-F:]+\/(12[0-8]|1[01]\d|\d?\d)$/

const createBlockSchema = z.object({
  version: z.enum(['IPv4', 'IPv6']),
  cidr: z
    .string()
    .min(1)
    .refine(
      (v) => ipv4CidrRegex.test(v) || ipv6CidrRegex.test(v),
      'Invalid CIDR. Examples: 10.0.0.0/24 or 2001:db8::/32'
    ),
  description: z.string().max(160).optional(),
  status: z.enum(['active', 'reserved', 'deprecated']).default('active'),
})

// -------------------------- Utilities --------------------------

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString()
  } catch {
    return d
  }
}

function fuzzyIncludes(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.trim().toLowerCase())
}

// -------------------------- Main Page --------------------------

export default function NetworkIPs() {
  const { t } = useLocale()
  const { toast } = useToast()

  // Simulated load + local state (swap with real API later)
  const [loading, setLoading] = useState(true)
  const [blocks, setBlocks] = useState<IPBlock[]>([])

  // UI state
  const [query, setQuery] = useState('')
  const [versionFilter, setVersionFilter] = useState<IPVersion | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<IPBlockStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const pageSize = 8

  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<IPBlock | null>(null)

  // Simulated fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setBlocks([
        {
          id: '1',
          version: 'IPv4',
          cidr: '10.0.0.0/24',
          description: 'Private LAN range',
          status: 'active',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          version: 'IPv6',
          cidr: '2001:db8::/48',
          description: 'Documentation block example',
          status: 'reserved',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  // Derived list
  const filtered = useMemo(() => {
    return blocks
      .filter((b) => (versionFilter === 'all' ? true : b.version === versionFilter))
      .filter((b) => (statusFilter === 'all' ? true : b.status === statusFilter))
      .filter((b) =>
        query
          ? fuzzyIncludes(b.cidr, query) || fuzzyIncludes(b.description ?? '', query)
          : true
      )
  }, [blocks, versionFilter, statusFilter, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  // -------------------------- Actions (replace with API) --------------------------

  async function createBlock(data: z.infer<typeof createBlockSchema>) {
    // TODO: call POST /api/settings/network/ip/blocks/create
    const now = new Date().toISOString()
    const newBlock: IPBlock = {
      id: crypto.randomUUID(),
      version: data.version,
      cidr: data.cidr,
      description: data.description,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    }
    setBlocks((prev) => [newBlock, ...prev])
    toast({ title: t('network_ip_page.toast_created', 'IP block created') })
  }

  async function updateBlock(id: string, patch: Partial<IPBlock>) {
    // TODO: call PUT /api/settings/network/ip/blocks/update/[id]
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch, updatedAt: new Date().toISOString() } : b))
    )
    toast({ title: t('network_ip_page.toast_updated', 'IP block updated') })
  }

  async function removeBlock(id: string) {
    // TODO: call DELETE /api/settings/network/ip/blocks/remove/[id]
    setBlocks((prev) => prev.filter((b) => b.id !== id))
    toast({ title: t('network_ip_page.toast_removed', 'IP block removed') })
  }

  // Reset page on filters change
  useEffect(() => {
    setPage(1)
  }, [query, versionFilter, statusFilter])

  const iconSize = 'h-4 w-4'

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
                await createBlock(values)
                setCreateOpen(false)
              }}
            />
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label={t('network_ip_page.total_blocks', 'Total Blocks')}
          value={blocks.length}
        />
        <StatCard
          label={t('network_ip_page.total_ipv4', 'IPv4 Blocks')}
          value={blocks.filter((b) => b.version === 'IPv4').length}
        />
        <StatCard
          label={t('network_ip_page.total_ipv6', 'IPv6 Blocks')}
          value={blocks.filter((b) => b.version === 'IPv6').length}
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            {t('network_ip_page.existing_blocks_title', 'Existing IP Blocks')}
          </CardTitle>
          <CardDescription className="text-xs">
            {t(
              'network_ip_page.existing_blocks_description',
              'Manage your allocated IPv4 and IPv6 address blocks.'
            )}
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
                          <Badge variant={b.version === 'IPv4' ? 'default' : 'secondary'}>
                            {b.version}
                          </Badge>
                        </Td>
                        <Td className="font-medium">{b.cidr}</Td>
                        <Td className="truncate max-w-[260px]" title={b.description}>
                          {b.description || '-'}
                        </Td>
                        <Td>
                          <StatusBadge status={b.status} />
                        </Td>
                        <Td className="text-muted-foreground">{formatDate(b.updatedAt)}</Td>
                        <Td className="text-right">
                          <RowActions
                            onEdit={() => setEditing(b)}
                            onDelete={() => removeBlock(b.id)}
                          />
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
                  {Math.min(page * pageSize, filtered.length)} {t('common.of', 'of')}{' '}
                  {filtered.length}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    {t('common.prev', 'Prev')}
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      size="sm"
                      variant={p === page ? 'default' : 'outline'}
                      onClick={() => setPage(p)}
                      className="w-9"
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    {t('common.next', 'Next')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && (
          <CreateOrEditBlockDialog
            title={t('network_ip_page.edit_ip_block_button', 'Edit IP Block')}
            defaultValues={editing}
            onSubmit={async (values) => {
              await updateBlock(editing.id, values as any)
              setEditing(null)
            }}
          />
        )}
      </Dialog>
    </div>
  )
}

// -------------------------- Subcomponents --------------------------

function Th({ children, className, ...props }: React.PropsWithChildren<React.ThHTMLAttributes<HTMLTableCellElement>>) {
  return (
    <th {...props} className={cn('px-3 py-2 text-xs font-semibold text-muted-foreground', className)}>
      {children}
    </th>
  )
}

function Td({ children, className, ...props }: React.PropsWithChildren<React.TdHTMLAttributes<HTMLTableCellElement>>) {
  return (
    <td {...props} className={cn('px-3 py-2 align-middle', className)}>
      {children}
    </td>
  )
}

function StatusBadge({ status }: { status: IPBlockStatus }) {
  const map: Record<IPBlockStatus, { label: string; icon: React.ReactNode; variant: 'default' | 'secondary' | 'destructive' }>
    = {
    active: {
      label: 'Active',
      icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
      variant: 'default',
    },
    reserved: {
      label: 'Reserved',
      icon: <Info className="h-3.5 w-3.5 mr-1" />,
      variant: 'secondary',
    },
    deprecated: {
      label: 'Deprecated',
      icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
      variant: 'destructive',
    },
  }
  const meta = map[status]
  return (
    <Badge variant={meta.variant} className="capitalize">
      {meta.icon}
      {meta.label}
    </Badge>
  )
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="py-3">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit} className="gap-2">
          <Pencil className="h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="gap-2 focus:bg-destructive/10">
          <Trash2 className="h-4 w-4" /> Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function CreateOrEditBlockDialog({
  title,
  defaultValues,
  onSubmit,
}: {
  title: string
  defaultValues?: Partial<IPBlock>
  onSubmit: (values: z.infer<typeof createBlockSchema>) => Promise<void>
}) {
  const { t } = useLocale()
  const { toast } = useToast()

  const [values, setValues] = React.useState<z.infer<typeof createBlockSchema>>({
    version: (defaultValues?.version as IPVersion) || 'IPv4',
    cidr: defaultValues?.cidr || '',
    description: defaultValues?.description || '',
    status: (defaultValues?.status as IPBlockStatus) || 'active',
  })
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const valid = React.useMemo(() => {
    const res = createBlockSchema.safeParse(values)
    return res.success
  }, [values])

  async function handleSubmit() {
    const parsed = createBlockSchema.safeParse(values)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Invalid data')
      return
    }
    try {
      setSubmitting(true)
      await onSubmit(parsed.data)
      toast({ title: t('common.saved', 'Saved') })
    } catch (e: any) {
      setError(e?.message || 'Failed to save')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {t('network_ip_page.dialog_description', 'Define the CIDR block and metadata.')}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>{t('network_ip_page.version', 'Version')}</Label>
            <div className="mt-2 flex gap-2">
              {(['IPv4', 'IPv6'] as const).map((v) => (
                <Button
                  key={v}
                  variant={values.version === v ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setValues((s) => ({ ...s, version: v }))}
                >
                  {v}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <div className="mt-2 flex gap-2 flex-wrap">
              {(['active', 'reserved', 'deprecated'] as const).map((s) => (
                <Button
                  key={s}
                  variant={values.status === s ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setValues((v) => ({ ...v, status: s }))}
                  className="capitalize"
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label>CIDR</Label>
          <Input
            value={values.cidr}
            onChange={(e) => setValues((s) => ({ ...s, cidr: e.target.value }))}
            placeholder={values.version === 'IPv4' ? '10.0.0.0/24' : '2001:db8::/48'}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {values.version === 'IPv4'
              ? 'Example: 192.168.1.0/24'
              : 'Example: 2001:db8:1234::/48'}
          </p>
        </div>

        <div>
          <Label>{t('common.description', 'Description')}</Label>
          <Input
            value={values.description || ''}
            onChange={(e) => setValues((s) => ({ ...s, description: e.target.value }))}
            placeholder={t('common.optional', 'Optional')}
          />
        </div>

        {error && (
          <div className="text-xs text-destructive flex items-center gap-2">
            <XCircle className="h-4 w-4" /> {error}
          </div>
        )}
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" disabled={submitting} onClick={() => history.back()}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button onClick={handleSubmit} disabled={!valid || submitting}>
          {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {t('common.save', 'Save')}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Code className="h-6 w-6 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">
        No IP blocks configured yet. Click "Add IP Block" to create one.
      </p>
      <Button className="mt-3" onClick={onAdd}>
        <PlusCircle className="h-4 w-4 mr-2" /> Add IP Block
      </Button>
    </div>
  )
}
