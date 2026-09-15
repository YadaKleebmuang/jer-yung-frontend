"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { LatestItemsTabs } from "./LatestItemsTabs";
import type { TransactionItemListItem } from "@/types/transaction-item";

export interface DashboardInteractiveProps {
  lostItems: TransactionItemListItem[];
  foundItems: TransactionItemListItem[];
  basePath?: string;
}

export function DashboardInteractive({
  lostItems,
  foundItems,
  basePath = "/items",
}: DashboardInteractiveProps) {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q") || "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(q);
  }, [searchParams]);

  const normalizedQuery = query.trim().toLowerCase();

  const filterItem = useCallback((item: TransactionItemListItem) => {
    if (!normalizedQuery) return true;
    return (
      item.transactionItemsName.toLowerCase().includes(normalizedQuery) ||
      (Array.isArray(item.categories) ? item.categories.some(c => c?.categoryName?.toLowerCase().includes(normalizedQuery)) : (item.categories?.categoryName?.toLowerCase().includes(normalizedQuery) ?? false)) ||
      (Array.isArray(item.location) ? item.location.some(l => l?.locationName?.toLowerCase().includes(normalizedQuery)) : (item.location?.locationName?.toLowerCase().includes(normalizedQuery) ?? false)) ||
      (item.transactionItemsLocationDetails?.toLowerCase().includes(normalizedQuery) ?? false)
    );
  }, [normalizedQuery]);

  const filteredLostItems = useMemo(() => lostItems.filter(filterItem), [lostItems, filterItem]);
  const filteredFoundItems = useMemo(() => foundItems.filter(filterItem), [foundItems, filterItem]);

  return (
    <>
      <section className="mt-6 rounded-2xl bg-surface p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="flex min-h-11 flex-1 items-center gap-3 rounded-lg bg-surface-muted px-4">
            <Search className="size-5 shrink-0 text-text-secondary" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาจากชื่อ, สถานที่, หมวดหมู่..."
              aria-label="ค้นหารายการสิ่งของ"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-text-secondary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-medium text-white"
            >
              ทั้งหมด
            </button>
          </div>
        </div>
      </section>

      <LatestItemsTabs
        lostItems={filteredLostItems}
        foundItems={filteredFoundItems}
        basePath={basePath}
        searchQuery={normalizedQuery}
      />
    </>
  );
}
