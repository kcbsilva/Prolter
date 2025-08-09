"use client";
import { Button } from "@/components/ui/button";
import { PlusCircle, Code } from "lucide-react";

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Code className="h-6 w-6 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">
        No IP blocks configured yet. Click "Add IP Block" to create one.
      </p>
      <Button className="mt-3" onClick={onAdd}>
        <PlusCircle className="h-4 w-4 mr-2" /> Add IP Block
      </Button>
    </div>
  );
}
