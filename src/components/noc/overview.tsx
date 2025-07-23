// src/app/noc/overview/page.tsx
'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wifi, Radio } from 'lucide-react';

export function NocOverview() {
  const [tab, setTab] = React.useState('fttx');

  return (
    <div className="flex h-full">
      <Tabs
        value={tab}
        onValueChange={setTab}
        className="flex w-full"
      >
        <TabsList className="w-64 shrink-0 flex-col items-start gap-1 rounded-none border-r bg-muted/40 p-4 text-left shadow-none">
          <span className="text-xs font-bold uppercase text-muted-foreground mb-2">FTTx</span>
          <TabsTrigger value="fttx" className="w-full justify-start">FTTx Dashboard</TabsTrigger>

          <span className="text-xs font-bold uppercase text-muted-foreground mt-6 mb-2">Wireless</span>
          <TabsTrigger value="wireless" className="w-full justify-start">Wireless Dashboard</TabsTrigger>
        </TabsList>

        <div className="flex-1 p-4">
          <TabsContent value="fttx" className="h-full">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-primary" /> OLTs Online
                </h2>
                <p className="mt-2 text-lg font-bold">12</p>
              </div>
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <h2 className="text-sm font-semibold">ONXs Active</h2>
                <p className="mt-2 text-lg font-bold">328</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wireless" className="h-full">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Radio className="w-4 h-4 text-primary" /> Access Points
                </h2>
                <p className="mt-2 text-lg font-bold">22</p>
              </div>
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <h2 className="text-sm font-semibold">CPEs Online</h2>
                <p className="mt-2 text-lg font-bold">1,742</p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}