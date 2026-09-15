"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function ItemsSearchInput({ basePath }: { basePath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(urlQuery);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(urlQuery);
  }, [urlQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (newQuery.trim()) {
        params.set("q", newQuery.trim());
      } else {
        params.delete("q");
      }
      params.delete("page"); // reset page on search
      const search = params.toString();
      router.replace(search ? `${basePath}?${search}` : basePath, { scroll: false });
    }, 300);
  };

  return (
    <div className="flex min-h-11 flex-1 items-center gap-3 rounded-lg bg-surface-muted px-4">
      <Search className="size-5 shrink-0 text-text-secondary" aria-hidden="true" />
      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="ค้นหาจากชื่อ, สถานที่, หมวดหมู่..."
        aria-label="ค้นหารายการสิ่งของ"
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-text-secondary"
      />
    </div>
  );
}
