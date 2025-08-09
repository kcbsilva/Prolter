"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Th(
  { children, className, ...props }:
  React.PropsWithChildren<React.ThHTMLAttributes<HTMLTableCellElement>>
) {
  return (
    <th {...props} className={cn("px-3 py-2 text-xs font-semibold text-muted-foreground", className)}>
      {children}
    </th>
  );
}

export function Td(
  { children, className, ...props }:
  React.PropsWithChildren<React.TdHTMLAttributes<HTMLTableCellElement>>
) {
  return (
    <td {...props} className={cn("px-3 py-2 align-middle", className)}>
      {children}
    </td>
  );
}
