// src/components/pages/sales/proposals/SalesProposals.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/shared/ui/button'
import { Input } from '@/components/shared/ui/input'
import {
  PlusCircle,
  Search,
  Filter,
  ChevronDown,
  FileText,
  Download,
  Mail,
  MoreHorizontal
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shared/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shared/ui/dropdown-menu'

type Proposal = {
  id: string
  title: string
  opportunity: string
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired'
  amount: number
  created: string
  validUntil: string
}

export default function SalesProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 'PROP-001',
      title: 'Enterprise Software Proposal',
      opportunity: 'Enterprise Software Deal',
      status: 'Sent',
      amount: 50000,
      created: '2023-10-15',
      validUntil: '2023-12-15'
    },
    {
      id: 'PROP-002',
      title: 'Marketing Services Proposal',
      opportunity: 'Marketing Services',
      status: 'Draft',
      amount: 25000,
      created: '2023-10-20',
      validUntil: '2023-12-20'
    },
    {
      id: 'PROP-003',
      title: 'Hardware Bundle Proposal',
      opportunity: 'Hardware Purchase',
      status: 'Accepted',
      amount: 120000,
      created: '2023-09-30',
      validUntil: '2023-11-30'
    }
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sales Proposals</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Proposal
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search proposals..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proposal Title</TableHead>
              <TableHead>Opportunity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.map((prop) => (
              <TableRow key={prop.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    {prop.title}
                  </div>
                </TableCell>
                <TableCell>{prop.opportunity}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    prop.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    prop.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    prop.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {prop.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">${prop.amount.toLocaleString()}</TableCell>
                <TableCell>{new Date(prop.created).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(prop.validUntil).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Download className="h-4 w-4" /> Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Send via Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}