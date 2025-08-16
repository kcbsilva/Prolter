// src/components/pages/settings/financials/gateways/ListGateways.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/shared/ui/button";
import { Edit, Trash } from "lucide-react";
import { UpdateGatewayModal } from "./UpdateGatewayModal";
import { RemoveGatewayDialog } from "./RemoveGatewayDialog";

export function ListGateways() {
  const [gateways, setGateways] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editGateway, setEditGateway] = React.useState<any | null>(null);
  const [removeGateway, setRemoveGateway] = React.useState<any | null>(null);

  const fetchGateways = async () => {
    setLoading(true);
    const res = await fetch("/api/financials/gateways");
    const data = await res.json();
    setGateways(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchGateways();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-2">
      {gateways.length === 0 && <p className="text-muted-foreground">No gateways found.</p>}
      {gateways.map((gateway) => (
        <div key={gateway.id} className="flex items-center justify-between border rounded p-2">
          <span>{gateway.name}</span>
          <div className="space-x-2">
            <Button size="sm" variant="outline" onClick={() => setEditGateway(gateway)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setRemoveGateway(gateway)}>
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}

      <UpdateGatewayModal gateway={editGateway} onClose={() => setEditGateway(null)} />
      <RemoveGatewayDialog gateway={removeGateway} onClose={() => setRemoveGateway(null)} />
    </div>
  );
}
