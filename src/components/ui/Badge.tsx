import {
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "neutral"
  | "purple"
  | "yellow"
  | "success"
  | "danger"
  | "info";

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral:
    "bg-surface-muted text-text-secondary",
  purple:
    "bg-brand-purple-soft text-brand-purple",
  yellow:
    "bg-brand-yellow/30 text-foreground",
  success:
    "bg-success/20 text-foreground",
  danger:
    "bg-danger/10 text-danger",
  info:
    "bg-info/15 text-info",
};

export function Badge({
  variant = "neutral",
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
