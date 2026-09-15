"use client";

import Link from "next/link";
import { useState } from "react";

import { EmptyState } from "@/components/shared/EmptyState";
import { LatestItemCard } from "@/features/dashboard/LatestItemCard";
import { type TransactionItemListItem } from "@/types/transaction-item";

type LatestItemsTab = "lost" | "found";

export interface LatestItemsTabsProps {
  lostItems: TransactionItemListItem[];
  foundItems: TransactionItemListItem[];
  basePath?: string;
  searchQuery?: string;
}

export function LatestItemsTabs({
  lostItems,
  foundItems,
  basePath = "/items",
  searchQuery = "",
}: LatestItemsTabsProps) {
  const [activeTab, setActiveTab] =
    useState<LatestItemsTab>("lost");

  const isSearching = searchQuery.length > 0;
  const items = isSearching
    ? [...lostItems, ...foundItems]
    : (activeTab === "lost"
      ? lostItems
      : foundItems);

  return (
    <section className="mt-6 rounded-2xl bg-surface p-6">
      {!isSearching && (
        <div className="flex items-end gap-7 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("lost")}
          className={
            activeTab === "lost"
              ? "border-b-2 border-brand-purple pb-3 text-lg font-bold text-brand-purple"
              : "pb-3 text-lg font-semibold text-text-secondary"
          }
        >
          ของหายล่าสุด
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("found")}
          className={
            activeTab === "found"
              ? "border-b-2 border-brand-purple pb-3 text-lg font-bold text-brand-purple"
              : "pb-3 text-lg font-semibold text-text-secondary"
          }
        >
          พบของล่าสุด
        </button>
      </div>
      )}

      {items.length === 0 ? (
        <div className="py-8">
          <EmptyState
            title={
              isSearching
                ? "ไม่พบรายการที่ตรงกับการค้นหา"
                : (activeTab === "lost"
                  ? "ยังไม่มีรายการของหาย"
                  : "ยังไม่มีรายการพบของ")
            }
            description={
              isSearching
                ? "ลองค้นหาด้วยคำอื่น"
                : (activeTab === "lost"
                  ? "เมื่อมีการแจ้งของหาย รายการล่าสุดจะแสดงที่นี่"
                  : "เมื่อมีการแจ้งพบของ รายการล่าสุดจะแสดงที่นี่")
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <LatestItemCard
              key={item.transactionItemId}
              item={item}
              basePath={basePath}
            />
          ))}
        </div>
      )}



      {!isSearching && (
        <div className="mt-7 text-center">
          <Link
            href={
              activeTab === "lost"
                ? `${basePath}?type=LOST`
                : `${basePath}?type=FOUND`
            }
            className="text-sm font-semibold text-brand-purple"
          >
            ดูทั้งหมด
          </Link>
        </div>
      )}
    </section>
  );
}
