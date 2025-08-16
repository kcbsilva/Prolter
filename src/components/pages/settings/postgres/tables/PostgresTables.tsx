// src/app/admin/settings/postgres/tables/page.tsx
'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/shared/ui/card";
import { Button } from '@/components/shared/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/shared/ui/select';
import { Table2, PlusCircle } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { PaginatedSkeletonTable } from '@/components/ui/paginated-skeleton-table';

interface Database {
  id: string;
  name: string;
}

interface TableColumn {
  column_name: string;
  data_type: string;
}

export default function PostgresTables() {
  const { t } = useLocale();
  const [databases, setDatabases] = useState<Database[]>([]);
  const [selectedDb, setSelectedDb] = useState<string>('');
  const [tables, setTables] = useState<string[]>([]);
  const [loadingDbs, setLoadingDbs] = useState<boolean>(true);
  const [loadingTables, setLoadingTables] = useState<boolean>(false);

  const [openTables, setOpenTables] = useState<Record<string, boolean>>({});
  const [tableDetails, setTableDetails] = useState<Record<string, TableColumn[]>>({});
  const [loadingTable, setLoadingTable] = useState<string | null>(null);

  const iconSize = "h-3 w-3";

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const res = await fetch('/api/settings/postgres/databases');
        const data = await res.json();
        setDatabases(data);
        if (data.length > 0) setSelectedDb(data[0].name);
      } catch (error) {
        console.error('Error fetching databases:', error);
      } finally {
        setLoadingDbs(false);
      }
    };
    fetchDatabases();
  }, []);

  useEffect(() => {
    if (!selectedDb) return;

    const fetchTables = async () => {
      setLoadingTables(true);
      try {
        const res = await fetch(`/api/settings/postgres/tables?db=${selectedDb}`);
        const data = await res.json();
        setTables(data);
      } catch (error) {
        console.error('Error fetching tables:', error);
      } finally {
        setLoadingTables(false);
      }
    };

    fetchTables();
    setOpenTables({});
    setTableDetails({});
  }, [selectedDb]);

  const handleToggleTable = async (table: string) => {
    setOpenTables((prev) => ({ ...prev, [table]: !prev[table] }));

    if (!openTables[table] && !tableDetails[table]) {
      setLoadingTable(table);
      try {
        const res = await fetch(`/api/settings/postgres/table-details?db=${selectedDb}&table=${table}`);
        const data = await res.json();
        setTableDetails((prev) => ({ ...prev, [table]: data }));
      } catch (err) {
        console.error('Failed to fetch table columns', err);
      } finally {
        setLoadingTable(null);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Table2 className={`${iconSize} text-primary`} />
          {t('sidebar.settings_postgres_tables', 'PostgreSQL Tables')}
        </h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className={`mr-2 ${iconSize}`} />
          {t('postgres_tables.add_table_button', 'Create Table')}
        </Button>
      </div>

      <div className="w-full max-w-sm">
        {loadingDbs ? (
          <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
        ) : (
          <Select value={selectedDb} onValueChange={setSelectedDb}>
            <SelectTrigger>
              <SelectValue placeholder={t('postgres_tables.select_db', 'Select Database')} />
            </SelectTrigger>
            <SelectContent>
              {databases.map((db) => (
                <SelectItem key={db.id ?? db.name} value={db.name}>
                  {db.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            {t('postgres_tables.list_title', 'Tables')}
          </CardTitle>
          <CardDescription className="text-xs">
            {selectedDb
              ? `${t('postgres_tables.list_description', 'Tables in')} ${selectedDb}`
              : t('postgres_tables.select_db_prompt', 'Please select a database to view its tables.')}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {loadingTables ? (
            <PaginatedSkeletonTable
              columns={[{ key: 'name', label: 'Table Name' }]}
              page={1}
              totalPages={1}
              onPageChange={() => { }}
              onRefresh={() => { }}
            >
              <></>
            </PaginatedSkeletonTable>
          ) : tables.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-2">{t('postgres_tables.table_name', 'Table Name')}</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table) => {
                  const isOpen = openTables[table] ?? false;
                  const details = tableDetails[table] ?? [];

                  return (
                    <React.Fragment key={table}>
                      <tr
                        className="border-t cursor-pointer hover:bg-muted/40"
                        onClick={() => handleToggleTable(table)}
                      >
                        <td className="px-4 py-2 flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {isOpen ? '▾' : '▸'}
                          </span>
                          <span>{table}</span>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className="border-t bg-muted/10 text-xs text-muted-foreground">
                          <td className="px-4 py-2">
                            {loadingTable === table ? (
                              <div className="animate-pulse text-muted">Loading columns...</div>
                            ) : details.length === 0 ? (
                              <div>No columns found.</div>
                            ) : (
                              <ul className="list-disc list-inside space-y-1">
                                {details.map((col) => (
                                  <li key={col.column_name}>
                                    <strong>{col.column_name}</strong> – {col.data_type}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-xs text-muted-foreground px-4 py-6">
              {t('postgres_tables.no_tables_found', 'No tables found in this database.')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
