import Image from "next/image";
import Link from "next/link";
import { MapPin, Package, UserRound, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { type TransactionItemListItem } from "@/types/transaction-item";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";

export interface LatestItemCardProps {
  item: TransactionItemListItem;
  basePath?: string;
  onClick?: () => void;
  onEdit?: () => void;
}

function formatItemDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.replace("T", " ").slice(0, 16);
  }

  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}`;
}

function getItemImageUrl(imagePath?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

  if (!baseUrl || !imagePath) {
    return null;
  }

  return `${baseUrl}/api/images/${imagePath}`;
}

export function LatestItemCard({
  item,
  basePath = "/items",
  onClick,
  onEdit,
}: LatestItemCardProps) {
  const currentUserId = useCurrentUserId();
  const isOwner = currentUserId !== null && item.users?.userId === currentUserId;

  const isLost = item.transactionItemsPostType === "LOST";

  const location = [
    item.location?.locationName,
    item.transactionItemsLocationDetails,
  ]
    .filter(Boolean)
    .join(" • ");

  const imageUrl = getItemImageUrl(item.imageUrl?.[0]);

  const innerContent = (
    <>
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
          <Badge variant={isLost ? "danger" : "yellow"}>
            {isLost ? "หาย" : "พบ"}
          </Badge>
        </div>

        <span className="absolute right-3 top-3 rounded-md bg-white/80 px-2 py-1 text-[10px] text-text-secondary backdrop-blur-sm">
          ID: {item.transactionItemId}
        </span>

        {isOwner && (
          <div className="absolute bottom-0 left-0 rounded-tr-xl bg-brand-purple px-2.5 py-1 text-[10px] font-semibold text-white inline-flex items-center gap-1.5">
            <UserRound className="size-3" />
            โพสต์ของคุณ
          </div>
        )}
      </div>

      <div className="p-4 text-left">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground truncate">
            {item.transactionItemsName}
          </h3>
          
          {isOwner && (
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onEdit) onEdit();
              }}
              className="inline-flex shrink-0 items-center gap-1 rounded-md bg-brand-purple/15 px-2 py-1 text-[10px] font-semibold text-brand-purple transition-colors hover:bg-brand-purple/25 cursor-pointer"
            >
              <Pencil className="size-3" />
              แก้ไข
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-text-secondary">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />

          <span className="truncate">
            {location || "ไม่ระบุสถานที่"}
          </span>
        </div>

        <p className="mt-1 text-xs text-text-secondary">
          {formatItemDate(item.transactionItemsDate)}
        </p>
      </div>
    </>
  );

  const className = `group block w-full overflow-hidden rounded-xl border transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple ${isOwner ? "border-brand-purple/50 bg-brand-purple/[0.02]" : "border-border bg-surface"}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {innerContent}
      </button>
    );
  }

  return (
    <Link href={`${basePath}/${item.transactionItemId}`} className={className}>
      {innerContent}
    </Link>
  );
}
