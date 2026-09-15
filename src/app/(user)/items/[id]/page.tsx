import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Package,
  Tag,
  UserRound,
  Warehouse,
} from "lucide-react";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { ApiError } from "@/services/api-client";
import { getTransactionItemById } from "@/services/transaction-item.service";

export const dynamic = "force-dynamic";

export interface ItemDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

function getStatusLabel(
  status: string | null,
) {
  switch (status) {
    case "PENDING":
      return "กำลังตามหา";
    case "FOUNDED":
      return "พบของแล้ว";
    case "IN_CENTER":
      return "อยู่ที่ศูนย์กลาง";
    case "RETURNED":
      return "คืนเจ้าของแล้ว";
    default:
      return status ?? "ไม่ระบุ";
  }
}

function getItemImageUrl(
  imagePath?: string,
) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(
      /\/+$/,
      "",
    );

  if (!baseUrl || !imagePath) {
    return null;
  }

  return `${baseUrl}/api/images/${imagePath}`;
}

export default async function ItemDetailPage({
  params,
}: ItemDetailPageProps) {
  const { id } = await params;
  const itemId = Number.parseInt(id, 10);

  if (
    !Number.isFinite(itemId) ||
    itemId <= 0
  ) {
    notFound();
  }

  let response;

  try {
    response =
      await getTransactionItemById(itemId);
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 404
    ) {
      notFound();
    }

    throw error;
  }

  const item = response.content;
  const isLost =
    item.Transaction_items_post_type === "LOST";

  const location = [
    item.Location?.Location_name,
    item.Transaction_items_location_details,
  ]
    .filter(Boolean)
    .join(" • ");

  const imageUrl = getItemImageUrl(
    item.ImageUrl?.[0],
  );

  return (
    <div className="py-8">
      <PageContainer>
        <Link
          href="/items"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-purple"
        >
          <ArrowLeft
            className="size-4"
            aria-hidden="true"
          />
          กลับไปยังรายการสิ่งของ
        </Link>

        <section className="mt-6 overflow-hidden rounded-2xl bg-surface">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative flex min-h-80 items-center justify-center overflow-hidden bg-surface-muted">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={item.Transaction_items_name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <Package
                  className="size-24 text-brand-purple/20"
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant={
                    isLost
                      ? "danger"
                      : "yellow"
                  }
                >
                  {isLost ? "ของหาย" : "พบของ"}
                </Badge>

                <span className="text-sm text-text-secondary">
                  ID: {item.Transaction_item_id}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold text-foreground">
                {item.Transaction_items_name}
              </h1>

              <div className="mt-7 space-y-5">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-brand-purple" />

                  <div>
                    <p className="text-sm font-medium text-foreground">
                      สถานที่
                    </p>

                    <p className="mt-1 text-sm text-text-secondary">
                      {location || "ไม่ระบุสถานที่"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Tag className="mt-0.5 size-5 shrink-0 text-brand-purple" />

                  <div>
                    <p className="text-sm font-medium text-foreground">
                      หมวดหมู่
                    </p>

                    <p className="mt-1 text-sm text-text-secondary">
                      {item.Categories?.category_name ??
                        "ไม่ระบุหมวดหมู่"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CalendarDays className="mt-0.5 size-5 shrink-0 text-brand-purple" />

                  <div>
                    <p className="text-sm font-medium text-foreground">
                      วันที่แจ้ง
                    </p>

                    <p className="mt-1 text-sm text-text-secondary">
                      {item.Transaction_items_date}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <UserRound className="mt-0.5 size-5 shrink-0 text-brand-purple" />

                  <div>
                    <p className="text-sm font-medium text-foreground">
                      ผู้แจ้ง
                    </p>

                    <p className="mt-1 text-sm text-text-secondary">
                      {item.Users?.user_name ??
                        "ไม่ระบุผู้แจ้ง"}
                    </p>
                  </div>
                </div>


                {item.Transaction_items_post_type ===
                  "FOUND" &&
                  item.Transaction_items_storage_type && (
                    <div className="flex gap-3">
                      <Warehouse className="mt-0.5 size-5 shrink-0 text-brand-purple" />

                      <div>
                        <p className="text-sm font-medium text-foreground">
                          รูปแบบการเก็บรักษา
                        </p>

                        <p className="mt-1 text-sm text-text-secondary">
                          {item.Transaction_items_storage_type ===
                          "CENTRAL"
                            ? "ส่งเก็บที่ศูนย์กลาง"
                            : item.Transaction_items_storage_type ===
                                "SELF"
                              ? "ผู้เก็บได้เก็บรักษาเอง"
                              : item.Transaction_items_storage_type}
                        </p>
                      </div>
                    </div>
                  )}
              </div>

              {item.Transaction_item_reference_tag && (
                <div className="mt-7 rounded-xl bg-surface-muted p-4">
                  <p className="text-xs text-text-secondary">
                    รหัสอ้างอิง
                  </p>

                  <p className="mt-1 font-semibold text-foreground">
                    {item.Transaction_item_reference_tag}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {item.Status_logs.length > 0 && (
          <section className="mt-6 rounded-2xl bg-surface p-6">
            <h2 className="text-xl font-bold text-foreground">
              ประวัติสถานะ
            </h2>

            <div className="mt-6 space-y-5">
              {item.Status_logs.map((log) => (
                <div
                  key={log.log_id}
                  className="flex gap-4"
                >
                  <div className="mt-1 flex flex-col items-center">
                    <span className="size-3 rounded-full bg-brand-purple" />
                    <span className="mt-2 h-full w-px bg-border" />
                  </div>

                  <div className="min-w-0 flex-1 pb-2">
                    <p className="font-medium text-foreground">
                      {getStatusLabel(log.old_status)}
                      {" → "}
                      {getStatusLabel(log.new_status)}
                    </p>

                    <p className="mt-1 text-sm text-text-secondary">
                      {log.changed_at}
                    </p>

                    {log.changed_by && (
                      <p className="mt-1 text-sm text-text-secondary">
                        ดำเนินการโดย {log.changed_by}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </PageContainer>
    </div>
  );
}
