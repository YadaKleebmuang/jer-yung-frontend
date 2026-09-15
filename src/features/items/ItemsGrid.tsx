"use client";

import { useState } from "react";
import { LatestItemCard } from "@/features/dashboard/LatestItemCard";
import { StorageDetailModal } from "@/features/items/StorageFlowModals";
import { type TransactionItemListItem } from "@/types/transaction-item";

export interface ItemsGridProps {
  items: TransactionItemListItem[];
  basePath: string;
}

export function ItemsGrid({ items, basePath }: ItemsGridProps) {
  const [selectedItem, setSelectedItem] = useState<TransactionItemListItem | null>(null);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <LatestItemCard
            key={item.transactionItemId}
            item={item}
            basePath={basePath}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {selectedItem && (
        <StorageDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}
