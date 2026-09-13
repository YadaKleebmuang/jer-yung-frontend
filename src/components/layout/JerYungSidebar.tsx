"use client";

import { LogOut } from "lucide-react";
import { Brand } from "@/components/shared/Brand";
import { SidebarNav } from "@/components/layout/SidebarNav";
import {
  navigationByRole,
  type UserRole,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

export interface JerYungSidebarProps {
  role: UserRole;
  onLogout?: () => void;
  className?: string;
}

export function JerYungSidebar({
  role,
  onLogout,
  className,
}: JerYungSidebarProps) {
  const items = navigationByRole[role];

  return (
    <div
      className={cn(
        "flex h-full flex-col px-5 py-6",
        className,
      )}
    >
      <Brand className="mb-8 px-2" />

      <SidebarNav items={items} />

      <div className="mt-auto border-t border-border pt-4">
        <button
          type="button"
          onClick={onLogout}
          disabled={!onLogout}
          className={cn(
            "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2",
            "text-sm font-medium text-text-secondary",
            "transition-colors duration-200",
            "hover:bg-surface-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <LogOut
            className="size-5 shrink-0"
            aria-hidden="true"
          />

          <span>ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );
}
