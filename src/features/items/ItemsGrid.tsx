"use client";

import { useState } from "react";
import { LatestItemCard } from "@/features/dashboard/LatestItemCard";
import { StorageDetailModal } from "@/features/items/StorageFlowModals";
import { UserEditPostModal } from "@/features/items/UserEditPostModal";
import { type TransactionItemListItem } from "@/types/transaction-item";

export interface ItemsGridProps {
  items: TransactionItemListItem[];
  basePath: string;
}

export function ItemsGrid({ items, basePath }: ItemsGridProps) {
  const [selectedItem, setSelectedItem] = useState<TransactionItemListItem | null>(null);
  const [editingItem, setEditingItem] = useState<TransactionItemListItem | null>(null);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <LatestItemCard
            key={item.transactionItemId}
            item={item}
            basePath={basePath}
            onClick={() => setSelectedItem(item)}
            onEdit={() => setEditingItem(item)}
          />
        ))}
      </div>

      {selectedItem && (
        <StorageDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {editingItem && (
        <UserEditPostModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={(updated) => {
            // Ideally trigger a refetch or update local state
            setEditingItem(null);
            window.location.reload(); // Quick way to refresh data
          }}
        />
      )}
    </>
  );
}
