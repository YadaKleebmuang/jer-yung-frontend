import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Package,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { type TransactionItemListItem } from "@/types/transaction-item";

export interface LatestItemCardProps {
  item: TransactionItemListItem;
}

function formatItemDate(value: string) {
  return value
    .replace("T", " ")
    .slice(0, 16);
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

export function LatestItemCard({
  item,
}: LatestItemCardProps) {
  const isLost =
    item.transactionItemsPostType === "LOST";

  const location = [
    item.location?.locationName,
    item.transactionItemsLocationDetails,
  ]
    .filter(Boolean)
    .join(" • ");

  const imageUrl = getItemImageUrl(
    item.imageUrl?.[0],
  );

  return (
    <Link
      href={`/items/${item.transactionItemId}`}
      className="group block overflow-hidden rounded-xl border border-border bg-surface transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
    >
      <div className="relative flex aspect-[5/3] items-center justify-center overflow-hidden bg-surface-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.transactionItemsName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <Package
            className="size-14 text-brand-purple/20 transition-transform group-hover:scale-105"
            aria-hidden="true"
          />
        )}

        <div className="absolute left-3 top-3">
          <Badge
            variant={
              isLost
                ? "danger"
                : "yellow"
            }
          >
            {isLost ? "หาย" : "พบ"}
          </Badge>
        </div>

        <span className="absolute right-3 top-3 rounded-md bg-white/80 px-2 py-1 text-[10px] text-text-secondary backdrop-blur-sm">
          ID: {item.transactionItemId}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground">
          {item.transactionItemsName}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-text-secondary">
          <MapPin
            className="size-3.5 shrink-0"
            aria-hidden="true"
          />

          <span>
            {location || "ไม่ระบุสถานที่"}
          </span>
        </div>

        <p className="mt-1 text-xs text-text-secondary">
          {formatItemDate(
            item.transactionItemsDate,
          )}
        </p>
      </div>
    </Link>
  );
}
