"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Brand } from "@/components/shared/Brand";
import { SidebarNav } from "@/components/layout/SidebarNav";
import {
  navigationByRole,
  type UserRole,
} from "@/lib/navigation";
import {
  AUTH_ROLE_STORAGE_KEY,
} from "@/lib/auth-session";
import { cn } from "@/lib/utils";
import {
  logout,
} from "@/services/auth.service";

export interface JerYungSidebarProps {
  role: UserRole;
  className?: string;
}

export function JerYungSidebar({
  role,
  className,
}: JerYungSidebarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const items = navigationByRole[role];

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();

      window.localStorage.removeItem(
        AUTH_ROLE_STORAGE_KEY,
      );

      router.replace("/login");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col px-5 py-6",
        className,
      )}
    >
      <Brand
        className="mb-8 px-2"
        href={items[0]?.href || "/dashboard"}
      />

      <SidebarNav items={items} />

      <div className="mt-auto border-t border-border pt-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
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

          <span>
            {isLoggingOut
              ? "กำลังออกจากระบบ..."
              : "ออกจากระบบ"}
          </span>
        </button>
      </div>
    </div>
  );
}
