// src/components/pages/settings/financials/gateways/UpdateGatewayModal.tsx
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UpdateGatewayModal({ gateway, onClose }: { gateway: any; onClose: () => void }) {
  const [name, setName] = React.useState(gateway?.name || "");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setName(gateway?.name || "");
  }, [gateway]);

  const handleUpdate = async () => {
    setLoading(true);
    await fetch(`/api/financials/gateways/update/${gateway.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setLoading(false);
    onClose();
  };

  if (!gateway) return null;

  return (
    <Dialog open={!!gateway} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Gateway</DialogTitle>
        </DialogHeader>
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading || !name}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
