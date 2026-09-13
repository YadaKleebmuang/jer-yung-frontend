import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BrandProps {
  href?: string;
  compact?: boolean;
  className?: string;
}

export function Brand({
  href = "/dashboard",
  compact = false,
  className,
}: BrandProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-3 rounded-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple",
        className,
      )}
      aria-label="Jer-Yung หน้าหลัก"
    >
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-purple text-sm font-bold text-white"
        aria-hidden="true"
      >
        BRU
      </span>

      {!compact && (
        <span className="min-w-0">
          <span className="block truncate text-xl font-bold text-brand-purple">
            Jer-Yung
          </span>

          <span className="block truncate text-xs text-text-secondary">
            มหาวิทยาลัยราชภัฏบุรีรัมย์
          </span>
        </span>
      )}
    </Link>
  );
}
