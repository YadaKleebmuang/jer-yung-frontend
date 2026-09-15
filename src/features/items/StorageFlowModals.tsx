"use client";

import {
  type FormEvent,
  useState,
} from "react";
import Image from "next/image";
import {
  Archive,
  Calendar,
  CircleCheck,
  Eye,
  Headphones,
  Hourglass,
  ImageIcon,
  MapPin,
  MessageSquare,
  Package,
  Pencil,
  Printer,
  Search,
  Send,
  Save,
  Trash2,
  UserRound,
  Phone,
  Building2,
  ImagePlus,
  Warehouse,
  X,
} from "lucide-react";

import { ApiError } from "@/services/api-client";
import {
  updateCentralItemBasic,
  handoverToCentral,
  type CentralStatus,
  type CentralStorageStats,
} from "@/services/central-storage.service";
import { type Category } from "@/types/category";
import { type TransactionItemListItem } from "@/types/transaction-item";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "";

function getImageUrl(path: string) {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${API_URL}/api/images/${path}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "th-TH",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function getCentralStatusLabel(
  status: CentralStatus,
) {
  switch (status) {
    case "PENDING":
      return "รอดำเนินการ";
    case "FOUNDED":
      return "พบสิ่งของ";
    case "IN_CENTER":
      return "อยู่ในคลังกลาง";
    case "RETURNED":
      return "ส่งคืนแล้ว";
  }
}

export interface StorageInventoryModalProps {
  open: boolean;
  items: TransactionItemListItem[];
  stats: CentralStorageStats | null;
  statsLoading: boolean;
  statsError: string | null;
  listLoading: boolean;
  listError: string | null;
  page: number;
  totalPages: number;
  totalElements: number;
  appliedKeyword: string;
  categories: Category[];
  categoryId: string;
  status: CentralStatus | "";
  onPageChange: (page: number) => void;
  onSearch: (keyword: string) => void;
  onCategoryChange: (
    categoryId: string,
  ) => void;
  onStatusChange: (
    status: CentralStatus | "",
  ) => void;
  onClose: () => void;
  onView: (
    item: TransactionItemListItem,
  ) => void;
  onEdit: (
    item: TransactionItemListItem,
  ) => void;
  onReturn: (
    item: TransactionItemListItem,
  ) => void;
}

export function StorageInventoryModal({
  open,
  items,
  stats,
  statsLoading,
  statsError,
  listLoading,
  listError,
  page,
  totalPages,
  totalElements,
  appliedKeyword,
  categories,
  categoryId,
  status,
  onPageChange,
  onSearch,
  onCategoryChange,
  onStatusChange,
  onClose,
  onView,
  onEdit,
  onReturn,
}: StorageInventoryModalProps) {
  const selectedCategoryName =
    categories.find(
      (category) =>
        String(category.categoryId) ===
        categoryId,
    )?.categoryName;

  const hasActiveFilters = Boolean(
    appliedKeyword ||
      categoryId ||
      status,
  );

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="flex max-h-[92vh] w-full max-w-[1280px] flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-5 border-b border-border px-7 py-6">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-purple/10">
              <Warehouse className="size-6 text-brand-purple" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-brand-purple">
                  รายการสิ่งของในคลังกลางทั้งหมด
                </h2>

                <span className="rounded-md bg-brand-purple/10 px-2 py-1 text-[11px] font-medium text-brand-purple">
                  Buriram Rajabhat Univ.
                </span>
              </div>

              <p className="mt-1 text-sm text-text-secondary">
                ตรวจสอบ ค้นหา และจัดการสิ่งของที่จัดเก็บอยู่ในคลังกลาง มหาวิทยาลัยราชภัฏบุรีรัมย์
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden h-10 items-center gap-2 rounded-lg bg-surface-muted px-4 text-sm font-semibold text-foreground transition-colors hover:bg-border sm:inline-flex"
            >
              <Printer className="size-4 text-brand-purple" />
              พิมพ์รายงานสรุป
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex size-10 items-center justify-center rounded-lg bg-surface-muted text-text-secondary transition-colors hover:text-foreground"
              aria-label="ปิด"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto bg-background">
          <div className="space-y-5 p-6">
            {/* Stats */}
            <section className="grid gap-4 md:grid-cols-3">
              <article className="rounded-xl bg-surface p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-text-secondary">
                      สิ่งของในคลังปัจจุบัน
                    </p>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-4xl font-bold text-brand-purple">
                        {statsLoading
                          ? "…"
                          : stats
                            ? stats.total_in_center
                            : "—"}
                      </span>
                      <span className="pb-1 text-sm text-text-secondary">
                        รายการ
                      </span>
                    </div>
                  </div>

                  <div className="flex size-12 items-center justify-center rounded-lg bg-surface-muted">
                    <Archive className="size-6 text-brand-purple" />
                  </div>
                </div>
              </article>

              <article className="rounded-xl bg-surface p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-text-secondary">
                      รอส่งมอบเข้าส่วนกลาง
                    </p>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-4xl font-bold text-brand-purple">
                        {statsLoading
                          ? "…"
                          : stats
                            ? stats.pending_handover
                            : "—"}
                      </span>
                      <span className="pb-1 text-sm text-text-secondary">
                        ชิ้น
                      </span>
                    </div>
                  </div>

                  <div className="flex size-12 items-center justify-center rounded-lg bg-brand-purple/10">
                    <Hourglass className="size-6 text-brand-purple" />
                  </div>
                </div>
              </article>

              <article className="rounded-xl bg-surface p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-text-secondary">
                      ส่งคืนสำเร็จ
                    </p>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-4xl font-bold text-green-500">
                        {statsLoading
                          ? "…"
                          : stats
                            ? stats.successfully_returned
                            : "—"}
                      </span>
                      <span className="pb-1 text-sm text-text-secondary">
                        รายการ
                      </span>
                    </div>
                  </div>

                  <div className="flex size-12 items-center justify-center rounded-lg bg-green-50">
                    <CircleCheck className="size-6 text-green-500" />
                  </div>
                </div>
              </article>
            </section>

            {statsError ? (
              <p
                role="alert"
                className="text-sm text-danger"
              >
                ไม่สามารถโหลดสถิติคลังกลาง:{" "}
                {statsError}
              </p>
            ) : null}

            {/* Filters */}
            <section className="rounded-xl bg-surface p-5">
              <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_180px]">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();

                    const formData =
                      new FormData(
                        event.currentTarget,
                      );

                    onSearch(
                      String(
                        formData.get(
                          "keyword",
                        ) ?? "",
                      ),
                    );
                  }}
                  className="flex h-11 items-center gap-3 rounded-lg bg-surface-muted px-4"
                >
                  <Search className="size-4 shrink-0 text-brand-purple" />

                  <input
                    key={appliedKeyword}
                    name="keyword"
                    type="search"
                    defaultValue={appliedKeyword}
                    disabled={listLoading}
                    placeholder="ค้นหาแล้วกด Enter..."
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none disabled:opacity-60"
                  />
                </form>

                <select
                  value={categoryId}
                  onChange={(event) =>
                    onCategoryChange(
                      event.target.value,
                    )
                  }
                  disabled={
                    listLoading ||
                    categories.length === 0
                  }
                  className="h-11 rounded-lg border border-border bg-surface-muted px-3 text-sm text-foreground disabled:opacity-70"
                >
                  <option value="">
                    {categories.length === 0
                      ? "ยังไม่มีหมวดหมู่"
                      : "ทุกหมวดหมู่"}
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.categoryName}
                      </option>
                    ),
                  )}
                </select>

                <select
                  value={status}
                  onChange={(event) =>
                    onStatusChange(
                      event.target.value as
                        | CentralStatus
                        | "",
                    )
                  }
                  disabled={listLoading}
                  className="h-11 rounded-lg border border-border bg-surface-muted px-3 text-sm text-foreground disabled:opacity-70"
                >
                  <option value="">
                    สถานะ: ทั้งหมด
                  </option>
                  <option value="PENDING">
                    รอดำเนินการ
                  </option>
                  <option value="FOUNDED">
                    พบสิ่งของ
                  </option>
                  <option value="IN_CENTER">
                    อยู่ในคลังกลาง
                  </option>
                  <option value="RETURNED">
                    ส่งคืนแล้ว
                  </option>
                </select>

                <select
                  disabled
                  className="h-11 rounded-lg border border-border bg-surface-muted px-3 text-sm text-foreground disabled:opacity-70"
                >
                  <option>ช่วงเวลา: ยังไม่รองรับ</option>
                </select>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-xs text-text-secondary">
                <span>ตัวกรองที่เลือก:</span>

                {appliedKeyword ? (
                  <span className="rounded-md bg-brand-purple/10 px-2.5 py-1 font-medium text-brand-purple">
                    ค้นหา: {appliedKeyword}
                  </span>
                ) : null}

                {categoryId ? (
                  <span className="rounded-md bg-brand-purple/10 px-2.5 py-1 font-medium text-brand-purple">
                    หมวดหมู่:{" "}
                    {selectedCategoryName ??
                      categoryId}
                  </span>
                ) : null}

                {status ? (
                  <span className="rounded-md bg-brand-purple/10 px-2.5 py-1 font-medium text-brand-purple">
                    สถานะ:{" "}
                    {getCentralStatusLabel(
                      status,
                    )}
                  </span>
                ) : null}

                {!hasActiveFilters ? (
                  <span>ยังไม่มี</span>
                ) : null}
              </div>
            </section>

            {listError ? (
              <p
                role="alert"
                className="text-sm text-danger"
              >
                ไม่สามารถโหลดรายการคลังกลาง:{" "}
                {listError}
              </p>
            ) : null}

            {/* Table */}
            <section className="overflow-hidden rounded-xl bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left">
                  <thead className="bg-surface-muted text-xs font-semibold text-text-secondary">
                    <tr>
                      <th className="px-5 py-4">
                        รหัสอ้างอิง
                      </th>
                      <th className="px-5 py-4">
                        สิ่งของ & ลักษณะเด่น
                      </th>
                      <th className="px-5 py-4">
                        หมวดหมู่ & ตำแหน่งคลัง
                      </th>
                      <th className="px-5 py-4">
                        วันเวลาที่รับเข้า
                      </th>
                      <th className="px-5 py-4">
                        ผู้นำส่ง / ผู้รับฝาก
                      </th>
                      <th className="px-5 py-4 text-center">
                        สถานะ
                      </th>
                      <th className="px-5 py-4 text-center">
                        จัดการ
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {items.map((item) => {
                      const thumbnail =
                        item.imageUrl[0]
                          ? getImageUrl(
                              item.imageUrl[0],
                            )
                          : null;

                      return (
                        <tr
                          key={
                            item.transactionItemId
                          }
                          className="text-sm"
                        >
                          <td className="px-5 py-5">
                            <span className="whitespace-nowrap rounded-md bg-brand-purple/10 px-2.5 py-1 font-bold text-brand-purple">
                              {item.transactionItemReferenceTag ??
                                "—"}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex min-w-[230px] items-start gap-3">
                              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-muted">
                                {thumbnail ? (
                                  <Image
                                    src={thumbnail}
                                    alt={
                                      item.transactionItemsName
                                    }
                                    width={70}
                                    height={70}
                                    className="size-14 object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="size-5 text-text-secondary/50" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-foreground">
                                  {item.transactionItemsName}
                                </p>

                                <p className="mt-1 line-clamp-2 max-w-[220px] text-xs leading-5 text-text-secondary">
                                  {item.transactionItemsLocationDetails ??
                                    "ไม่มีรายละเอียดเพิ่มเติม"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <p className="font-medium text-foreground">
                              {item.categories
                                ?.categoryName ??
                                "—"}
                            </p>

                            <p className="mt-1 text-xs text-text-secondary">
                              {item.location
                                ?.locationName ??
                                "—"}
                            </p>
                          </td>

                          <td className="px-5 py-5 text-text-secondary">
                            {formatDate(
                              item.transactionItemsDate,
                            )}
                          </td>

                          <td className="px-5 py-5">
                            <p className="font-medium text-foreground">
                              {item.users?.userName ??
                                "—"}
                            </p>

                            <p className="mt-1 text-xs text-text-secondary">
                              เจ้าหน้าที่รับฝาก
                            </p>
                          </td>

                          <td className="px-5 py-5 text-center">
                            {item.currentStatus ? (
                              <span className="inline-flex whitespace-nowrap rounded-full bg-brand-purple/10 px-2.5 py-1 text-xs font-semibold text-brand-purple">
                                {getCentralStatusLabel(
                                  item.currentStatus,
                                )}
                              </span>
                            ) : (
                              <span className="text-xs text-text-secondary">
                                —
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  onView(item)
                                }
                                className="flex size-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-muted hover:text-brand-purple"
                                aria-label="ดูรายละเอียด"
                              >
                                <Eye className="size-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  onEdit(item)
                                }
                                className="flex size-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-muted hover:text-brand-purple"
                                aria-label="แก้ไข"
                              >
                                <Pencil className="size-4" />
                              </button>

                              {item.currentStatus ===
                              "IN_CENTER" ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onReturn(item)
                                  }
                                  className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md bg-brand-purple px-3 text-xs font-semibold text-white transition-colors hover:bg-brand-purple-hover"
                                >
                                  ส่งคืน
                                  <Send className="size-3" />
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {listLoading ? (
                <div className="px-6 py-16 text-center text-sm text-text-secondary">
                  กำลังโหลดรายการคลังกลาง...
                </div>
              ) : null}

              {!listLoading &&
              !listError &&
              items.length === 0 ? (
                <div className="px-6 py-16 text-center text-sm text-text-secondary">
                  ไม่พบรายการสิ่งของ
                </div>
              ) : null}

              {!listLoading &&
              !listError &&
              totalElements > 0 ? (
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-5 py-4">
                  <p className="text-sm text-text-secondary">
                    ทั้งหมด{" "}
                    <span className="font-semibold text-foreground">
                      {totalElements}
                    </span>{" "}
                    รายการ
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={page <= 0}
                      onClick={() =>
                        onPageChange(page - 1)
                      }
                      className="h-9 rounded-lg border border-border px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ก่อนหน้า
                    </button>

                    <span className="min-w-24 text-center text-sm text-text-secondary">
                      หน้า {page + 1} /{" "}
                      {Math.max(
                        totalPages,
                        1,
                      )}
                    </span>

                    <button
                      type="button"
                      disabled={
                        page + 1 >= totalPages
                      }
                      onClick={() =>
                        onPageChange(page + 1)
                      }
                      className="h-9 rounded-lg border border-border px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ถัดไป
                    </button>
                  </div>
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface StorageDetailModalProps {
  item: TransactionItemListItem;
  onClose: () => void;
}

export function StorageDetailModal({
  item,
  onClose,
}: StorageDetailModalProps) {
  const mainImage = item.imageUrl[0]
    ? getImageUrl(item.imageUrl[0])
    : null;

  const contactName =
    item.users?.userName ??
    "เจ้าหน้าที่จุดรับฝากกลาง";

  const contactPhone =
    item.users?.userPhoneNumber;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="relative grid max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-surface shadow-2xl lg:grid-cols-[1.2fr_0.8fr]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex size-10 items-center justify-center rounded-lg bg-surface-muted text-text-secondary transition-colors hover:text-foreground"
          aria-label="ปิด"
        >
          <X className="size-5" />
        </button>

        {/* Images */}
        <section className="border-b border-border p-7 lg:border-b-0 lg:border-r">
          <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-xl bg-surface-muted">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={item.transactionItemsName}
                width={900}
                height={650}
                className="h-full max-h-[500px] w-full object-contain"
              />
            ) : (
              <ImageIcon className="size-16 text-text-secondary/35" />
            )}
          </div>

          {item.imageUrl.length > 1 ? (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {item.imageUrl
                .slice(0, 5)
                .map((image) => (
                  <Image
                    key={image}
                    src={getImageUrl(image)}
                    alt=""
                    width={110}
                    height={86}
                    className="h-20 w-24 shrink-0 rounded-lg border border-border object-cover"
                  />
                ))}
            </div>
          ) : null}
        </section>

        {/* Information */}
        <section className="space-y-5 p-7 pt-16 lg:pt-7">
          <article className="rounded-xl bg-surface p-1">
            <div className="flex items-start justify-between gap-4 pr-16">
              <div>
                <h2 className="text-3xl font-bold text-brand-purple">
                  {item.transactionItemsName}
                </h2>

                <p className="mt-1 text-xl font-semibold text-text-secondary">
                  {item.transactionItemReferenceTag ??
                    "ไม่มีรหัสอ้างอิง"}
                </p>
              </div>

              <span className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-purple/15 px-3 py-1 text-xs font-semibold text-brand-purple">
                <CircleCheck className="size-3.5" />
                เก็บได้
              </span>
            </div>

            <p className="mt-3 leading-7 text-text-secondary">
              {item.transactionItemsLocationDetails ??
                "ไม่มีรายละเอียดเพิ่มเติม"}
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                  <Calendar className="size-5 text-brand-purple" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">
                    วันที่พบ / รับเข้า
                  </p>
                  <p className="mt-1 font-medium text-foreground">
                    {formatDate(
                      item.transactionItemsDate,
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                  <MapPin className="size-5 text-brand-purple" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">
                    สถานที่พบ
                  </p>
                  <p className="mt-1 font-medium text-foreground">
                    {item.location?.locationName ??
                      "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                  <Package className="size-5 text-brand-purple" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">
                    หมวดหมู่
                  </p>
                  <p className="mt-1 font-medium text-foreground">
                    {item.categories?.categoryName ??
                      "—"}
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-border p-5">
            <h3 className="text-xl font-bold text-foreground">
              ข้อมูลผู้ติดต่อ / จุดรับฝาก
            </h3>

            <div className="mt-4 rounded-lg bg-surface-muted p-4">
              <p className="text-xs text-text-secondary">
                สถานะปัจจุบัน
              </p>

              <div className="mt-2 flex items-center gap-2 font-semibold text-brand-purple">
                <Warehouse className="size-4" />
                <span>
                  {item.location
                    ?.centralStationName ??
                    "ฝากไว้ที่จุดรับฝากกลาง"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-purple/15">
                <Headphones className="size-6 text-brand-purple" />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-foreground">
                  {contactName}
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  {contactPhone ??
                    "ยังไม่มีข้อมูลเบอร์โทร"}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={!contactPhone}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-yellow text-sm font-semibold text-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MessageSquare className="size-4" />
              ติดต่อขอรับคืน
            </button>
          </article>
        </section>
      </div>
    </div>
  );
}

export interface StorageEditModalProps {
  item: TransactionItemListItem;
  onClose: () => void;
  onSaved: (
    item: TransactionItemListItem,
  ) => void;
}

export function StorageEditModal({
  item,
  onClose,
  onSaved,
}: StorageEditModalProps) {
  const [name, setName] = useState(
    item.transactionItemsName,
  );

  const [details, setDetails] = useState(
    item.transactionItemsLocationDetails ??
      "",
  );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError(
        "กรุณากรอกชื่อสิ่งของ",
      );
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (
        item.transactionItemId >= 0
      ) {
        await updateCentralItemBasic({
          itemId:
            item.transactionItemId,
          itemName: name,
          itemDetails: details,
        });
      }

      onSaved({
        ...item,
        transactionItemsName:
          name.trim(),
        transactionItemsLocationDetails:
          details.trim(),
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(
          "ไม่สามารถบันทึกการแก้ไขได้",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleHandover() {
    if (
      item.transactionItemsPostType !== "FOUND" ||
      item.transactionItemsStorageType !== "SELF"
    ) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await handoverToCentral(item.transactionItemId);
      onSaved({
        ...item,
        transactionItemsStorageType: "CENTRAL",
        currentStatus: "IN_CENTER",
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("ไม่สามารถอัปเดตเป็นจุดรับฝากกลางได้");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-surface shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-5 border-b border-border px-6 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-purple/10">
              <Pencil className="size-5 text-brand-purple" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-brand-purple">
                  แก้ไขข้อมูลสิ่งของในคลัง
                </h2>

                <span className="rounded-md bg-brand-purple/10 px-2 py-1 text-xs font-semibold text-brand-purple">
                  {item.transactionItemReferenceTag ??
                    "ไม่มีรหัสอ้างอิง"}
                </span>

                <span className="rounded-md bg-brand-yellow/40 px-2 py-1 text-xs font-medium text-foreground">
                  ของฝากพิเศษ
                </span>
              </div>

              <p className="mt-1 text-xs text-text-secondary">
                ปรับปรุงรายละเอียด ตำแหน่งจัดเก็บ หรือสถานะของสิ่งของในคลังกลาง
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-text-secondary hover:text-foreground disabled:opacity-50"
            aria-label="ปิด"
          >
            <X className="size-5" />
          </button>
        </header>

        {/* Content */}
        <div className="overflow-y-auto bg-background p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* LEFT */}
            <div className="space-y-4">
              {/* Images */}
              <section className="rounded-xl bg-surface p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="size-4 text-brand-purple" />
                    <h3 className="font-bold text-foreground">
                      รูปภาพสิ่งของประกอบรายการ
                    </h3>
                  </div>

                  <span className="text-xs text-text-secondary">
                    ({item.imageUrl.length}/5 รูป)
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {item.imageUrl
                    .slice(0, 3)
                    .map((image, index) => (
                      <div
                        key={image}
                        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-muted"
                      >
                        <Image
                          src={getImageUrl(image)}
                          alt={`รูปที่ ${index + 1}`}
                          fill
                          className="object-cover"
                        />

                        {index === 0 ? (
                          <span className="absolute left-1 top-1 rounded bg-brand-purple px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            รูปหลัก
                          </span>
                        ) : null}
                      </div>
                    ))}

                  {item.imageUrl.length ===
                  0 ? (
                    <>
                      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-surface-muted">
                        <ImageIcon className="size-5 text-text-secondary/40" />
                      </div>
                      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-surface-muted">
                        <ImageIcon className="size-5 text-text-secondary/40" />
                      </div>
                      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-surface-muted">
                        <ImageIcon className="size-5 text-text-secondary/40" />
                      </div>
                    </>
                  ) : null}

                  <button
                    type="button"
                    disabled
                    title="ยังไม่รองรับการแก้ไขรูปภาพผ่าน API"
                    className="flex aspect-[4/3] flex-col items-center justify-center rounded-lg border border-dashed border-brand-purple/30 bg-surface-muted text-brand-purple opacity-60"
                  >
                    <ImagePlus className="size-5" />
                    <span className="mt-1 text-xs font-semibold">
                      เพิ่มรูป
                    </span>
                  </button>
                </div>
              </section>

              {/* Main item data */}
              <section className="rounded-xl bg-surface p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Package className="size-4 text-brand-purple" />
                  <h3 className="font-bold text-foreground">
                    ข้อมูลสิ่งของหลัก
                  </h3>
                </div>

                <label className="block text-xs font-medium text-text-secondary">
                  ชื่อสิ่งของ / ยี่ห้อ
                  <span className="ml-1 text-danger">
                    *
                  </span>
                </label>

                <input
                  value={name}
                  onChange={(event) => {
                    setName(
                      event.target.value,
                    );
                    setError(null);
                  }}
                  className="mt-1.5 h-10 w-full rounded-lg border border-border bg-surface-muted px-3 text-sm outline-none focus:border-brand-purple"
                />

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary">
                      หมวดหมู่
                    </label>

                    <div
                      title="ยังไม่รองรับการแก้ไขผ่าน API"
                      className="mt-1.5 flex h-10 items-center rounded-lg bg-surface-muted px-3 text-sm cursor-not-allowed opacity-80"
                    >
                      {item.categories
                        ?.categoryName ??
                        "—"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-secondary">
                      หมายเลขซีเรียล / IMEI
                    </label>

                    <div
                      title="ไม่มีฟิลด์นี้ในฐานข้อมูล"
                      className="mt-1.5 flex h-10 items-center rounded-lg bg-surface-muted px-3 text-sm text-text-secondary cursor-not-allowed opacity-80"
                    >
                      ไม่มีข้อมูล
                    </div>
                  </div>
                </div>

                <label className="mt-4 block text-xs font-medium text-text-secondary">
                  ลักษณะเด่น / สภาพตำหนิเฉพาะ
                  <span className="ml-1 text-danger">
                    *
                  </span>
                </label>

                <textarea
                  rows={4}
                  value={details}
                  onChange={(event) => {
                    setDetails(
                      event.target.value,
                    );
                    setError(null);
                  }}
                  className="mt-1.5 w-full resize-none rounded-lg border border-border bg-surface-muted p-3 text-sm outline-none focus:border-brand-purple"
                />
              </section>
            </div>

            {/* RIGHT */}
            <div className="space-y-4">
              {/* Depositor / staff */}
              <section className="rounded-xl bg-surface p-4">
                <div className="mb-4 flex items-center gap-2">
                  <UserRound className="size-4 text-brand-purple" />
                  <h3 className="font-bold text-foreground">
                    ข้อมูลผู้นำฝากและเจ้าหน้าที่ผู้รับเรื่อง
                  </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-text-secondary">
                      ชื่อ-นามสกุล ผู้นำส่ง
                    </label>
                    <div
                      title="ยังไม่รองรับการแก้ไขผ่าน API"
                      className="mt-1.5 flex h-10 items-center gap-2 rounded-lg bg-surface-muted px-3 text-sm cursor-not-allowed opacity-80"
                    >
                      <UserRound className="size-4 text-text-secondary" />
                      {item.users?.userName ??
                        "ไม่มีข้อมูล"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-text-secondary">
                      เบอร์โทร / ติดต่อ
                    </label>
                    <div
                      title="ยังไม่รองรับการแก้ไขผ่าน API"
                      className="mt-1.5 flex h-10 items-center gap-2 rounded-lg bg-surface-muted px-3 text-sm cursor-not-allowed opacity-80"
                    >
                      <Phone className="size-4 text-text-secondary" />
                      {item.users
                        ?.userPhoneNumber ??
                        "ไม่มีข้อมูล"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-text-secondary">
                      หน่วยงาน / สถานที่
                    </label>
                    <div
                      title="ยังไม่รองรับการแก้ไขผ่าน API"
                      className="mt-1.5 flex h-10 items-center gap-2 rounded-lg bg-surface-muted px-3 text-sm cursor-not-allowed opacity-80"
                    >
                      <Building2 className="size-4 text-text-secondary" />
                      {item.location
                        ?.locationName ??
                        "—"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-text-secondary">
                      ผู้รับเรื่องเข้าคลัง
                    </label>
                    <div
                      title="ยังไม่รองรับการแก้ไขผ่าน API"
                      className="mt-1.5 flex h-10 items-center rounded-lg bg-surface-muted px-3 text-sm cursor-not-allowed opacity-80"
                    >
                      เจ้าหน้าที่รับฝาก
                    </div>
                  </div>
                </div>
              </section>

              {/* Storage location */}
              <section className="rounded-xl bg-surface p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Warehouse className="size-4 text-brand-purple" />
                    <h3 className="font-bold text-foreground">
                      สถานที่จัดเก็บสิ่งของ / การเก็บรักษา
                    </h3>
                  </div>

                  <span className="rounded bg-brand-purple/10 px-2 py-1 text-[10px] font-semibold text-brand-purple">
                    คลังกลาง
                  </span>
                </div>

                <p className="text-xs text-text-secondary">
                  รูปแบบการถือครอง / จัดเก็บ
                </p>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={item.transactionItemsStorageType === "SELF" && item.transactionItemsPostType === "FOUND" ? handleHandover : undefined}
                    disabled={saving || (item.transactionItemsStorageType === "SELF" && item.transactionItemsPostType !== "FOUND")}
                    className={
                      item.transactionItemsStorageType === "CENTRAL"
                        ? "flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-purple/15 text-sm font-semibold text-brand-purple"
                        : (item.transactionItemsStorageType === "SELF" && item.transactionItemsPostType === "FOUND")
                        ? "flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-surface text-sm text-foreground hover:bg-surface-muted hover:text-brand-purple transition-colors disabled:opacity-50"
                        : "flex h-10 items-center justify-center gap-2 rounded-lg bg-surface-muted text-sm text-text-secondary cursor-not-allowed opacity-80"
                    }
                    title={item.transactionItemsStorageType === "SELF" && item.transactionItemsPostType === "FOUND" ? "คลิกเพื่อนำของเข้าจุดรับฝากกลาง" : undefined}
                  >
                    <Warehouse className="size-4" />
                    จุดรับฝากกลาง
                  </button>

                  <div
                    className={
                      item.transactionItemsStorageType === "SELF"
                        ? "flex h-10 items-center justify-center rounded-lg bg-brand-purple/15 text-sm font-semibold text-brand-purple"
                        : "flex h-10 items-center justify-center rounded-lg bg-surface-muted text-sm text-text-secondary"
                    }
                  >
                    อยู่ที่ตนเอง
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-text-secondary">
                    ตำแหน่ง / อาคาร
                  </p>

                  <div
                    title="ยังไม่รองรับการแก้ไขผ่าน API"
                    className="mt-1.5 flex h-10 items-center rounded-lg bg-surface-muted px-3 text-sm cursor-not-allowed opacity-80"
                  >
                    {item.location
                      ?.locationName ??
                      "—"}
                  </div>
                </div>
              </section>

              {/* Status */}
              <section className="rounded-xl bg-surface p-4">
                <div className="mb-4 flex items-center gap-2">
                  <CircleCheck className="size-4 text-brand-purple" />
                  <h3 className="font-bold text-foreground">
                    สถานะการดำเนินงานและการส่งมอบ
                  </h3>
                </div>

                <p className="text-xs text-text-secondary">
                  สถานะขั้นตอน
                </p>

                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <div
                    className={
                      item.currentStatus === "PENDING" || item.currentStatus === "FOUNDED"
                        ? "flex min-h-10 items-center justify-center rounded-lg bg-brand-yellow/40 px-2 text-center font-semibold"
                        : "flex min-h-10 items-center justify-center rounded-lg bg-surface-muted px-2 text-center text-text-secondary"
                    }
                  >
                    รอตรวจรับ / บันทึก
                  </div>

                  <div
                    className={
                      item.currentStatus === "IN_CENTER"
                        ? "flex min-h-10 items-center justify-center rounded-lg bg-brand-yellow/40 px-2 text-center font-semibold"
                        : "flex min-h-10 items-center justify-center rounded-lg bg-surface-muted px-2 text-center text-text-secondary"
                    }
                  >
                    รอดำเนินการ / รอเจ้าของ
                  </div>

                  <div
                    className={
                      item.currentStatus === "RETURNED"
                        ? "flex min-h-10 items-center justify-center rounded-lg bg-brand-yellow/40 px-2 text-center font-semibold"
                        : "flex min-h-10 items-center justify-center rounded-lg bg-surface-muted px-2 text-center text-text-secondary"
                    }
                  >
                    ส่งมอบคืนแล้ว
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-text-secondary">
                      ผู้รับคืน / บันทึกการส่งมอบ
                    </p>
                    <div
                      className={`mt-1.5 flex h-10 items-center rounded-lg px-3 text-sm ${item.currentStatus === "RETURNED" ? "bg-brand-purple/10 text-brand-purple font-medium" : "bg-surface-muted text-text-secondary cursor-not-allowed opacity-80"}`}
                    >
                      {item.currentStatus === "RETURNED"
                        ? (item.receiverName ?? "ไม่ระบุชื่อผู้รับคืน")
                        : "ยังไม่มีข้อมูล"}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-text-secondary">
                      หมายเหตุการแก้ไข
                    </p>
                    <div
                      title="ยังไม่รองรับการแก้ไขผ่าน API"
                      className="mt-1.5 flex h-10 items-center rounded-lg bg-surface-muted px-3 text-sm text-text-secondary cursor-not-allowed opacity-80"
                    >
                      —
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {error ? (
            <div
              role="alert"
              className="mt-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              {error}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <footer className="flex flex-col gap-3 border-t border-border bg-surface px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled
            title="ยังไม่เปิดการลบจาก Modal นี้"
            className="inline-flex items-center gap-2 text-sm font-medium text-danger opacity-60"
          >
            <Trash2 className="size-4" />
            ลบรายการนี้ออกจากคลัง
          </button>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-10 rounded-lg bg-surface-muted px-5 text-sm font-semibold text-foreground disabled:opacity-50"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={
                saving || !name.trim()
              }
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-purple px-5 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Save className="size-4" />
              {saving
                ? "กำลังบันทึก..."
                : "บันทึกการแก้ไข"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
