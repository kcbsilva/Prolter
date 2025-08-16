// src/components/pages/hr/employees/HREmployees.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/shared/ui/button'
import { Input } from '@/components/shared/ui/input'
import {
  PlusCircle,
  Search,
  Filter,
  ChevronDown,
  Mail,
  UserPlus,
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
import { Badge } from '@/components/shared/ui/badge'

type Employee = {
  id: string
  name: string
  email: string
  department: string
  position: string
  status: 'Active' | 'On Leave' | 'Terminated'
  hireDate: string
}

export default function HREmployees() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'EMP-001',
      name: 'John Smith',
      email: 'john.smith@company.com',
      department: 'Engineering',
      position: 'Senior Developer',
      status: 'Active',
      hireDate: '2020-05-15'
    },
    {
      id: 'EMP-002',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      department: 'Marketing',
      position: 'Marketing Manager',
      status: 'Active',
      hireDate: '2019-11-20'
    },
    {
      id: 'EMP-003',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      department: 'HR',
      position: 'HR Specialist',
      status: 'Active',
      hireDate: '2021-02-10'
    },
    {
      id: 'EMP-004',
      name: 'Emily Wilson',
      email: 'emily.w@company.com',
      department: 'Sales',
      position: 'Sales Representative',
      status: 'On Leave',
      hireDate: '2022-08-05'
    },
    {
      id: 'EMP-005',
      name: 'David Brown',
      email: 'david.b@company.com',
      department: 'Finance',
      position: 'Accountant',
      status: 'Active',
      hireDate: '2023-01-15'
    }
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employees</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search employees..." className="pl-8" />
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
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hire Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>
                  <a href={`mailto:${employee.email}`} className="text-primary hover:underline">
                    {employee.email}
                  </a>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{employee.department}</Badge>
                </TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      employee.status === 'Active' ? 'default' :
                      employee.status === 'On Leave' ? 'secondary' :
                      'destructive'
                    }
                  >
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(employee.hireDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Terminate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>Showing {employees.length} of {employees.length} employees</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}