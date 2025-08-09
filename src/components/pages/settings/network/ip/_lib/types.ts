import { z } from "zod";

export type IPVersion = "IPv4" | "IPv6";
export type IPBlockStatus = "active" | "reserved" | "deprecated";

export interface IPBlock {
  id: string;
  version: IPVersion;
  cidr: string;
  description?: string;
  status: IPBlockStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

// Basic (practical) CIDR validators
export const ipv4CidrRegex =
  /^(25[0-5]|2[0-4]\d|[01]?\d\d?)(\.(25[0-5]|2[0-4]\d|[01]?\d\d?)){3}\/(3[0-2]|[12]?\d)$/;
export const ipv6CidrRegex = /^[0-9a-fA-F:]+\/(12[0-8]|1[01]\d|\d?\d)$/;

export const createBlockSchema = z.object({
  version: z.enum(["IPv4", "IPv6"]),
  cidr: z
    .string()
    .min(1)
    .refine(
      (v) => ipv4CidrRegex.test(v) || ipv6CidrRegex.test(v),
      "Invalid CIDR. Examples: 10.0.0.0/24 or 2001:db8::/32"
    ),
  description: z.string().max(160).optional(),
  status: z.enum(["active", "reserved", "deprecated"]).default("active"),
});

export type CreateBlockInput = z.infer<typeof createBlockSchema>;
