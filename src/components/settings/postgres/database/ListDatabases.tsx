// src/components/settings/postgres/databases/ListDatabases.tsx
'use client';

import * as React from 'react';
import { Eye, Trash2, Edit } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { usePagination } from '@/hooks/usePagination';
import { useLocale } from '@/contexts/LocaleContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PaginatedTable } from '@/components/ui/table/PaginatedTable';
import { PaginatedSkeletonTable } from '@/components/ui/paginated-skeleton-table';

interface DatabaseEntry {
  name: string;
  owner: string;
  encoding: string;
  size?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  created?: string;
}

export function ListDatabases() {
  const { t } = useLocale();
  const [loading, setLoading] = React.useState(true);
  const [databases, setDatabases] = React.useState<DatabaseEntry[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchDatabases = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/postgres/databases');
      const data = await res.json();
      setDatabases(
        data.map((db: any) => ({
          name: db.name,
          owner: db.owner,
          encoding: db.encoding,
          size: db.size,
          status: 'active', // Placeholder; update if you implement real logic
          created: '', // Optional: if available in data
        }))
      );
    } catch (error) {
      console.error('Failed to fetch databases:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDatabases();
  }, []);

  const filteredData = databases.filter(
    (db) =>
      db.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      db.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      db.encoding.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { page, setPage, totalPages, currentData } = usePagination(filteredData, 10);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Maintenance</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Unknown</Badge>;
    }
  };

  const columns = [
    { key: 'name', label: 'Database Name' },
    { key: 'owner', label: 'Owner' },
    { key: 'encoding', label: 'Encoding' },
    { key: 'size', label: 'Size' },
    { key: 'status', label: 'Status' },
    { key: 'created', label: 'Created' },
  ];

  if (loading) {
    return (
      <PaginatedSkeletonTable
        columns={columns}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onRefresh={fetchDatabases}
        entriesCount={0} children={undefined}      />
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <PaginatedTable<DatabaseEntry>
        columns={columns}
        data={currentData}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onRefresh={fetchDatabases}
        loading={loading}
        totalEntries={filteredData.length}
        renderRow={(db, i) => (
          <TableRow key={db.name} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
            <TableCell className="text-center py-2">
              <input type="checkbox" className="rounded" />
            </TableCell>
            <TableCell className="py-2 text-center">
              <div className="font-medium text-gray-900 text-sm">{db.name}</div>
            </TableCell>
            <TableCell className="py-2 text-center">
              <div className="text-gray-700 text-sm">{db.owner}</div>
            </TableCell>
            <TableCell className="py-2 text-center">
              <div className="text-gray-700 text-sm">{db.encoding}</div>
            </TableCell>
            <TableCell className="py-2 text-center">
              <div className="text-gray-700 text-sm">{db.size}</div>
            </TableCell>
            <TableCell className="py-2 text-center">
              {getStatusBadge(db.status || 'unknown')}
            </TableCell>
            <TableCell className="py-2 text-center">
              <div className="text-gray-700 text-sm">{db.created}</div>
            </TableCell>
            <TableCell className="py-2 text-center">
              <div className="flex items-center gap-2 justify-center">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-gray-100">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-gray-100">
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-red-100 text-red-600">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
}
