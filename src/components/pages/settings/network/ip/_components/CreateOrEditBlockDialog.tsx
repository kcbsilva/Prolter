"use client";
import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, XCircle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/hooks/use-toast";
import { createBlockSchema, IPBlockStatus, IPVersion } from "@/components/pages/settings/network/ip/_lib/types";

export type CreateOrEditProps = {
  title: string;
  defaultValues?: Partial<z.infer<typeof createBlockSchema>>;
  onSubmit: (values: z.infer<typeof createBlockSchema>) => Promise<void>;
};

export default function CreateOrEditBlockDialog({ title, defaultValues, onSubmit }: CreateOrEditProps) {
  const { t } = useLocale();
  const { toast } = useToast();

  const [values, setValues] = React.useState<z.infer<typeof createBlockSchema>>({
    version: (defaultValues?.version as IPVersion) || "IPv4",
    cidr: defaultValues?.cidr || "",
    description: defaultValues?.description || "",
    status: (defaultValues?.status as IPBlockStatus) || "active",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const valid = React.useMemo(() => createBlockSchema.safeParse(values).success, [values]);

  async function handleSubmit() {
    const parsed = createBlockSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid data");
      return;
    }
    try {
      setSubmitting(true);
      await onSubmit(parsed.data);
      toast({ title: t("common.saved", "Saved") });
    } catch (e: any) {
      setError(e?.message || "Failed to save");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {t("network_ip_page.dialog_description", "Define the CIDR block and metadata.")}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>{t("network_ip_page.version", "Version")}</Label>
            <div className="mt-2 flex gap-2">
              {(["IPv4", "IPv6"] as const).map((v) => (
                <Button
                  key={v}
                  variant={values.version === v ? "default" : "outline"}
                  size="sm"
                  onClick={() => setValues((s) => ({ ...s, version: v }))}
                >
                  {v}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <div className="mt-2 flex gap-2 flex-wrap">
              {(["active", "reserved", "deprecated"] as const).map((s) => (
                <Button
                  key={s}
                  variant={values.status === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setValues((v) => ({ ...v, status: s }))}
                  className="capitalize"
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label>CIDR</Label>
          <Input
            value={values.cidr}
            onChange={(e) => setValues((s) => ({ ...s, cidr: e.target.value }))}
            placeholder={values.version === "IPv4" ? "10.0.0.0/24" : "2001:db8::/48"}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {values.version === "IPv4" ? "Example: 192.168.1.0/24" : "Example: 2001:db8:1234::/48"}
          </p>
        </div>

        <div>
          <Label>{t("common.description", "Description")}</Label>
          <Input
            value={values.description || ""}
            onChange={(e) => setValues((s) => ({ ...s, description: e.target.value }))}
            placeholder={t("common.optional", "Optional")}
          />
        </div>

        {error && (
          <div className="text-xs text-destructive flex items-center gap-2">
            <XCircle className="h-4 w-4" /> {error}
          </div>
        )}
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" disabled={submitting} onClick={() => history.back()}>
          {t("common.cancel", "Cancel")}
        </Button>
        <Button onClick={handleSubmit} disabled={!valid || submitting}>
          {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {t("common.save", "Save")}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
