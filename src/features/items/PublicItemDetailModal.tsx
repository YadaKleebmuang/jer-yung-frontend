"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CircleCheck,
  Headphones,
  ImageIcon,
  MapPin,
  MessageSquare,
  Package,
  Warehouse,
  X,
} from "lucide-react";

import { type TransactionItemListItem } from "@/types/transaction-item";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getImageUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_URL}/api/images/${path}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusLabel(status: string | null) {
  switch (status) {
    case "PENDING":
      return "รอดำเนินการ";
    case "FOUNDED":
      return "พบสิ่งของ";
    case "IN_CENTER":
      return "อยู่ในคลังกลาง";
    case "RETURNED":
      return "ส่งคืนแล้ว";
    default:
      return status ?? "ไม่ระบุสถานะ";
  }
}

export interface PublicItemDetailModalProps {
  item: TransactionItemListItem;
}

export function PublicItemDetailModal({ item }: PublicItemDetailModalProps) {
  const router = useRouter();

  const mainImage = item.imageUrl?.[0] ? getImageUrl(item.imageUrl[0]) : null;

  const contactName = item.users?.userName ?? "เจ้าหน้าที่จุดรับฝากกลาง";
  const contactPhone = item.users?.userPhoneNumber;
  const contactLine = item.users?.userLineId;
  const isLost = item.transactionItemsPostType === "LOST";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="relative grid max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-surface shadow-2xl lg:grid-cols-[1.2fr_0.8fr]">
        <button
          type="button"
          onClick={() => router.back()}
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

          {(item.imageUrl?.length ?? 0) > 1 ? (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {item.imageUrl.slice(0, 5).map((image) => (
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
                  {item.transactionItemReferenceTag ?? "ไม่มีรหัสอ้างอิง"}
                </p>
              </div>

              <span
                className={`mt-1 inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  isLost
                    ? "bg-danger/15 text-danger"
                    : "bg-brand-purple/15 text-brand-purple"
                }`}
              >
                <CircleCheck className="size-3.5" />
                {isLost ? "ของหาย" : "เก็บได้"}
              </span>
            </div>

            <p className="mt-3 leading-7 text-text-secondary">
              {item.transactionItemsLocationDetails ?? "ไม่มีรายละเอียดเพิ่มเติม"}
              {item.users?.userName ? ` (ผู้แจ้ง: ${item.users.userName})` : ""}
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
                    {formatDate(item.transactionItemsDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                  <MapPin className="size-5 text-brand-purple" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">สถานที่พบ</p>
                  <p className="mt-1 font-medium text-foreground">
                    {item.location?.locationName ?? "ไม่ระบุ"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                  <Package className="size-5 text-brand-purple" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">หมวดหมู่</p>
                  <p className="mt-1 font-medium text-foreground">
                    {item.categories?.categoryName ?? "ไม่ระบุ"}
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
              <p className="text-xs text-text-secondary">สถานะปัจจุบัน</p>

              <div className="mt-2 flex items-center gap-2 font-semibold text-brand-purple">
                <Warehouse className="size-4" />
                <span>
                  {item.transactionItemsStorageType === "SELF"
                    ? "ผู้เก็บได้เก็บรักษาเอง"
                    : item.currentStatus === "PENDING" &&
                        item.transactionItemsStorageType === "CENTRAL"
                      ? "ฝากไว้ที่จุดรับฝากกลาง"
                      : item.currentStatus
                        ? getStatusLabel(item.currentStatus)
                        : item.location?.centralStationName ?? "ไม่ทราบสถานะ"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-purple/15">
                <Headphones className="size-6 text-brand-purple" />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-foreground">{contactName}</p>
                <p className="mt-1 text-sm text-text-secondary">
                  {contactPhone ? `โทร: ${contactPhone}` : "ไม่มีเบอร์โทร"}
                  {contactLine ? ` | Line: ${contactLine}` : ""}
                </p>
              </div>
            </div>

          </article>
        </section>
      </div>
    </div>
  );
}
