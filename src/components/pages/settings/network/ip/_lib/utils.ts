import type { IPVersion } from "./types";

export function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

export function fuzzyIncludes(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}

/**
 * Calculate exponent only (bits remaining).
 * IPv4: bits = 32, IPv6: bits = 128.
 */
export function calcExpFromCIDR(version: IPVersion, cidr: string): number {
  const prefix = Number((cidr.split("/")[1] ?? "").trim());
  if (!Number.isFinite(prefix)) return 0;
  const bits = version === "IPv4" ? 32 : 128;
  return Math.max(0, bits - prefix);
}

/**
 * Pretty total count:
 * - IPv4: integer with separators using Math.pow (safe within Number range)
 * - IPv6: compact power-of-two string "2^exp"
 */
export function formatTotalCount(version: IPVersion, cidr: string): string {
  const exp = calcExpFromCIDR(version, cidr);
  if (version === "IPv4") {
    const count = Math.pow(2, exp); // up to 2^32 fits in JS Number exactly
    return numberToLocale(count);
  }
  return `2^${exp}`;
}

function numberToLocale(n: number): string {
  return n.toLocaleString();
}
