"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { type SidebarNavItem } from "@/types/navigation";

export interface SidebarNavProps {
  items: SidebarNavItem[];
  className?: string;
}

export function SidebarNav({
  items,
  className,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex flex-col gap-1",
        className,
      )}
      aria-label="เมนูหลัก"
    >
      {items.map((item) => {
        const Icon = item.icon;

        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
              "transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple",
              isActive
                ? "bg-brand-purple text-white"
                : "text-text-secondary hover:bg-surface-muted hover:text-foreground",
            )}
          >
            <Icon
              className="size-5 shrink-0"
              aria-hidden="true"
            />

            <span className="truncate">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
