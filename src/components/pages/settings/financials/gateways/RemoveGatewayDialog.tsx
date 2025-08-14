// src/components/pages/settings/financials/gateways/RemoveGatewayDialog.tsx
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function RemoveGatewayDialog({ gateway, onClose }: { gateway: any; onClose: () => void }) {
  const [loading, setLoading] = React.useState(false);

  const handleRemove = async () => {
    setLoading(true);
    await fetch(`/api/financials/gateways/remove/${gateway.id}`, { method: "DELETE" });
    setLoading(false);
    onClose();
  };

  if (!gateway) return null;

  return (
    <Dialog open={!!gateway} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Gateway</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to remove {gateway.name}?</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleRemove} disabled={loading}>
            {loading ? "Removing..." : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
