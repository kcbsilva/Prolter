// src/components/pages/sales/opportunities/SalesOpportunities.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  PlusCircle,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Opportunity = {
  id: string
  name: string
  company: string
  value: number
  stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost'
  expectedClose: string
  owner: string
}

export default function SalesOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 'OPP-001',
      name: 'Enterprise Software Deal',
      company: 'Acme Corp',
      value: 50000,
      stage: 'Proposal',
      expectedClose: '2023-12-15',
      owner: 'John Smith'
    },
    {
      id: 'OPP-002',
      name: 'Marketing Services',
      company: 'Globex Inc',
      value: 25000,
      stage: 'Negotiation',
      expectedClose: '2023-11-30',
      owner: 'Sarah Johnson'
    },
    {
      id: 'OPP-003',
      name: 'Hardware Purchase',
      company: 'Tech Solutions',
      value: 120000,
      stage: 'Qualification',
      expectedClose: '2024-01-20',
      owner: 'Mike Chen'
    }
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sales Opportunities</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Opportunity
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search opportunities..." className="pl-8" />
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
              <TableHead>Opportunity Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Expected Close</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map((opp) => (
              <TableRow key={opp.id}>
                <TableCell className="font-medium">{opp.name}</TableCell>
                <TableCell>{opp.company}</TableCell>
                <TableCell className="text-right">${opp.value.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    opp.stage === 'Closed Won' ? 'bg-green-100 text-green-800' :
                    opp.stage === 'Closed Lost' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {opp.stage}
                  </span>
                </TableCell>
                <TableCell>{new Date(opp.expectedClose).toLocaleDateString()}</TableCell>
                <TableCell>{opp.owner}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
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