import { notFound } from "next/navigation";
import { getTransactionItemById } from "@/services/transaction-item.service";
import { PublicItemDetailModal } from "@/features/items/PublicItemDetailModal";
import { type TransactionItemListItem } from "@/types/transaction-item";

export interface InterceptedItemDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InterceptedItemDetailPage({
  params,
}: InterceptedItemDetailPageProps) {
  const { id } = await params;
  const itemId = Number.parseInt(id, 10);

  if (!Number.isFinite(itemId) || itemId <= 0) {
    notFound();
  }

  let response;

  try {
    response = await getTransactionItemById(itemId);
  } catch (error: any) {
    if (error?.status === 404) {
      notFound();
    }
    throw error;
  }

  const detail = response.content;

  // Derive current status from status logs if available
  const latestLog = detail.Status_logs?.length
    ? detail.Status_logs[detail.Status_logs.length - 1]
    : null;
  const currentStatus = latestLog?.new_status as any;

  // Map to TransactionItemListItem to reuse the modal component type
  const item: TransactionItemListItem = {
    transactionItemId: detail.Transaction_item_id,
    imageUrl: detail.ImageUrl,
    transactionItemsPostType: detail.Transaction_items_post_type,
    transactionItemsName: detail.Transaction_items_name,
    transactionItemReferenceTag: detail.Transaction_item_reference_tag,
    transactionItemsLocationDetails: detail.Transaction_items_location_details,
    transactionItemsDate: detail.Transaction_items_date,
    transactionItemsStorageType: detail.Transaction_items_storage_type,
    currentStatus: currentStatus,
    location: detail.Location
      ? {
          locationId: detail.Location.Location_id,
          locationName: detail.Location.Location_name,
          isCentralStation: detail.Location.is_central_station,
          centralStationName: detail.Location.central_station_name,
        }
      : null,
    categories: detail.Categories
      ? {
          categoryId: detail.Categories.category_id,
          categoryName: detail.Categories.category_name,
        }
      : null,
    users: detail.Users
      ? {
          userId: detail.Users.user_id,
          userName: detail.Users.user_name,
          userPhoneNumber: detail.Users.user_phone_number,
          userLineId: detail.Users.user_line_id,
        }
      : null,
  };

  return <PublicItemDetailModal item={item} />;
}
