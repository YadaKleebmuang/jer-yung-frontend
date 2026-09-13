import Link from "next/link";
import { Search } from "lucide-react";

export interface DashboardFilterBarProps {
  defaultQuery?: string;
}

export function DashboardFilterBar({
  defaultQuery = "",
}: DashboardFilterBarProps) {
  return (
    <section className="mt-6 rounded-2xl bg-surface p-5">
      <form
        action="/dashboard"
        method="get"
        className="flex flex-col gap-4 xl:flex-row xl:items-center"
      >
        <div className="flex min-h-11 flex-1 items-center gap-3 rounded-lg bg-surface-muted px-4">
          <Search
            className="size-5 shrink-0 text-text-secondary"
            aria-hidden="true"
          />

          <input
            type="search"
            name="q"
            defaultValue={defaultQuery}
            placeholder="ค้นหาจากชื่อ, สถานที่, หมวดหมู่..."
            aria-label="ค้นหารายการสิ่งของ"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-text-secondary"
          />

          <button
            type="submit"
            className="sr-only"
          >
            ค้นหา
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard"
            className="rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-medium text-white"
          >
            ทั้งหมด
          </Link>
        </div>
      </form>
    </section>
  );
}
