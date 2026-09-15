import Link from "next/link";
import { Bell, CircleUserRound } from "lucide-react";

import { cn } from "@/lib/utils";

export interface JerYungHeaderProps {
  className?: string;
  profileHref?: string;
}

export function JerYungHeader({
  className,
  profileHref = "/profile",
}: JerYungHeaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-20 items-center gap-4 px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-lg",
            "text-text-secondary transition-colors",
            "hover:bg-surface-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple",
          )}
          aria-label="การแจ้งเตือน"
        >
          <Bell
            className="size-5"
            aria-hidden="true"
          />
        </button>

        <Link
          href={profileHref}
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-lg",
            "text-text-secondary transition-colors",
            "hover:bg-surface-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple",
          )}
          aria-label="โปรไฟล์ผู้ใช้"
        >
          <CircleUserRound
            className="size-5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}
