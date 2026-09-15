import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { ItemsSearchInput } from "@/features/items/ItemsSearchInput";

import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/shared/EmptyState";
import { LatestItemCard } from "@/features/dashboard/LatestItemCard";
import { getTransactionItems } from "@/services/transaction-item.service";
import { type TransactionItemPostType } from "@/types/transaction-item";

export interface ItemsListViewProps {
  searchParams: {
    type?: string;
    q?: string;
    page?: string;
  };
  basePath: string;
}

export async function ItemsListView({
  searchParams,
  basePath,
}: ItemsListViewProps) {
  const {
    type,
    q = "",
    page = "1",
  } = searchParams;

  const activeType: TransactionItemPostType | undefined =
    type === "LOST" || type === "FOUND"
      ? type
      : undefined;

  const query = q.trim();

  const parsedPage = Number.parseInt(page, 10);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  const response = await getTransactionItems({
    type: activeType,
    keyword: query || undefined,
    page: currentPage - 1,
    limit: 12,
  });

  const pagination = response.content;
  const items = pagination.content;

  function itemsHref(options?: {
    nextType?: TransactionItemPostType | null;
    nextPage?: number;
  }) {
    const params = new URLSearchParams();

    const finalType =
      options && options.nextType !== undefined
        ? options.nextType
        : activeType;

    if (finalType) {
      params.set("type", finalType);
    }

    if (query) {
      params.set("q", query);
    }

    if (options?.nextPage && options.nextPage > 1) {
      params.set("page", String(options.nextPage));
    }

    const search = params.toString();

    return search
      ? `${basePath}?${search}`
      : basePath;
  }

  return (
    <div className="py-8">
      <PageContainer>
        <section>
          <h1 className="text-3xl font-bold text-foreground">
            รายการสิ่งของ
          </h1>

          <p className="mt-2 text-text-secondary">
            รายการของหายและสิ่งของที่พบทั้งหมดในระบบ
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-surface p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <ItemsSearchInput basePath={basePath} />

            <div className="flex flex-wrap gap-2">
              <Link
                href={itemsHref({
                  nextType: null,
                })}
                className={
                  !activeType
                    ? "rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-medium text-white"
                    : "rounded-lg bg-surface-muted px-4 py-2.5 text-sm font-medium text-text-secondary"
                }
              >
                ทั้งหมด
              </Link>

              <Link
                href={itemsHref({
                  nextType: "LOST",
                })}
                className={
                  activeType === "LOST"
                    ? "rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-medium text-white"
                    : "rounded-lg bg-surface-muted px-4 py-2.5 text-sm font-medium text-text-secondary"
                }
              >
                ของหาย
              </Link>

              <Link
                href={itemsHref({
                  nextType: "FOUND",
                })}
                className={
                  activeType === "FOUND"
                    ? "rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-medium text-white"
                    : "rounded-lg bg-surface-muted px-4 py-2.5 text-sm font-medium text-text-secondary"
                }
              >
                พบของ
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-surface p-6">
          {items.length === 0 ? (
            <div className="py-10">
              <EmptyState
                title={
                  query
                    ? "ไม่พบรายการที่ค้นหา"
                    : activeType === "LOST"
                      ? "ยังไม่มีรายการของหาย"
                      : activeType === "FOUND"
                        ? "ยังไม่มีรายการพบของ"
                        : "ยังไม่มีรายการสิ่งของ"
                }
                description={
                  query
                    ? `ไม่พบรายการที่ตรงกับ "${query}"`
                    : activeType === "LOST"
                      ? "เมื่อมีการแจ้งของหาย รายการจะแสดงที่นี่"
                      : activeType === "FOUND"
                        ? "เมื่อมีการแจ้งพบของ รายการจะแสดงที่นี่"
                        : "เมื่อมีการแจ้งของหายหรือพบของ รายการจะแสดงที่นี่"
                }
              />
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <LatestItemCard
                  key={item.transactionItemId}
                  item={item}
                  basePath={basePath}
                />
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4 border-t border-border pt-6">
              {pagination.first ? (
                <span className="inline-flex items-center gap-1 rounded-lg bg-surface-muted px-3 py-2 text-sm text-text-secondary opacity-50">
                  <ChevronLeft className="size-4" />
                  ก่อนหน้า
                </span>
              ) : (
                <Link
                  href={itemsHref({
                    nextPage: currentPage - 1,
                  })}
                  className="inline-flex items-center gap-1 rounded-lg bg-surface-muted px-3 py-2 text-sm font-medium text-foreground"
                >
                  <ChevronLeft className="size-4" />
                  ก่อนหน้า
                </Link>
              )}

              <span className="text-sm text-text-secondary">
                หน้า{" "}
                <strong className="text-foreground">
                  {currentPage}
                </strong>{" "}
                / {pagination.totalPages}
              </span>

              {pagination.last ? (
                <span className="inline-flex items-center gap-1 rounded-lg bg-surface-muted px-3 py-2 text-sm text-text-secondary opacity-50">
                  ถัดไป
                  <ChevronRight className="size-4" />
                </span>
              ) : (
                <Link
                  href={itemsHref({
                    nextPage: currentPage + 1,
                  })}
                  className="inline-flex items-center gap-1 rounded-lg bg-surface-muted px-3 py-2 text-sm font-medium text-foreground"
                >
                  ถัดไป
                  <ChevronRight className="size-4" />
                </Link>
              )}
            </div>
          )}
        </section>
      </PageContainer>
    </div>
  );
}
