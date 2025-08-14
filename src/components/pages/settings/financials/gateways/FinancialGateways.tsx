// src/components/pages/settings/financials/gateways/FinancialGateways.tsx
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddGatewayModal } from "./AddGatewayModal";
import { ListGateways } from "./ListGateways";

export default function FinancialGateways() {
  const [openAdd, setOpenAdd] = React.useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment Gateways</CardTitle>
          <Button onClick={() => setOpenAdd(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Gateway
          </Button>
        </CardHeader>
        <CardContent>
          <ListGateways />
        </CardContent>
      </Card>

      <AddGatewayModal open={openAdd} onOpenChange={setOpenAdd} />
    </div>
  );
}
