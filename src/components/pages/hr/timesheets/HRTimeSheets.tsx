// src/components/pages/hr/timesheets/HRTimeSheets.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  PlusCircle,
  Search,
  Filter,
  ChevronDown,
  Download,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type TimeSheet = {
  id: string
  employee: string
  period: string
  hours: number
  status: 'Pending' | 'Approved' | 'Rejected'
  submitted: string
}

export default function HRTimeSheets() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [timeSheets, setTimeSheets] = useState<TimeSheet[]>([
    {
      id: 'TS-001',
      employee: 'John Smith',
      period: '2023-11-01 to 2023-11-15',
      hours: 80,
      status: 'Approved',
      submitted: '2023-11-16'
    },
    {
      id: 'TS-002',
      employee: 'Sarah Johnson',
      period: '2023-11-01 to 2023-11-15',
      hours: 75,
      status: 'Pending',
      submitted: '2023-11-17'
    },
    {
      id: 'TS-003',
      employee: 'Mike Chen',
      period: '2023-11-01 to 2023-11-15',
      hours: 82,
      status: 'Approved',
      submitted: '2023-11-15'
    }
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Time Sheets</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Time Sheet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search time sheets..." className="pl-8" />
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
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeSheets.map((sheet) => (
                  <TableRow key={sheet.id}>
                    <TableCell className="font-medium">{sheet.employee}</TableCell>
                    <TableCell>{sheet.period}</TableCell>
                    <TableCell className="text-right">{sheet.hours}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        sheet.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        sheet.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sheet.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(sheet.submitted).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Review</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="font-medium mb-2">Calendar</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          <div className="rounded-md border p-4">
            <h3 className="font-medium mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">Approve All Pending</Button>
              <Button variant="outline" className="w-full">Send Reminders</Button>
              <Button variant="outline" className="w-full">Generate Reports</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}