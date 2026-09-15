import { apiClient } from "@/services/api-client";
import {
  type ApiResponse,
  type PaginatedApiResponse,
} from "@/types/api";
import { type TransactionItemListItem } from "@/types/transaction-item";
import { type TransactionItemDetail } from "@/types/transaction-item-detail";

export type CentralStatus =
  | "PENDING"
  | "FOUNDED"
  | "IN_CENTER"
  | "RETURNED";

export interface CentralStorageStats {
  total_in_center: number;
  pending_handover: number;
  successfully_returned: number;
}

export interface GetCentralStorageItemsParams {
  keyword?: string;
  categoryId?: number;
  status?: CentralStatus;
  page?: number;
  limit?: number;
}

export function getCentralStorageStats() {
  return apiClient.get<
    ApiResponse<CentralStorageStats>
  >(
    "/api/transaction-items/central/stats",
  );
}

export function getCentralStorageItems({
  keyword,
  categoryId,
  status,
  page = 0,
  limit = 10,
}: GetCentralStorageItemsParams = {}) {
  const params = new URLSearchParams();

  if (keyword?.trim()) {
    params.set("keyword", keyword.trim());
  }

  if (categoryId !== undefined) {
    params.set(
      "categoryId",
      String(categoryId),
    );
  }

  if (status) {
    params.set("status", status);
  }

  params.set("page", String(page));
  params.set("limit", String(limit));

  return apiClient.get<
    PaginatedApiResponse<TransactionItemListItem>
  >(
    `/api/transaction-items/central?${params.toString()}`,
  );
}

export interface CheckoutCentralItemParams {
  itemId: number;
  receiverName: string;
  proofImage?: File;
}

export function checkoutCentralItem({
  itemId,
  receiverName,
  proofImage,
}: CheckoutCentralItemParams) {
  const formData = new FormData();

  formData.append(
    "receiverName",
    receiverName.trim(),
  );

  if (proofImage) {
    formData.append(
      "proofImage",
      proofImage,
    );
  }

  return apiClient.post<
    ApiResponse<unknown>
  >(
    `/api/transaction-items/${itemId}/check-out`,
    formData,
  );
}

export interface UpdateCentralItemBasicParams {
  itemId: number;
  itemName: string;
  itemDetails: string;
}

export function updateCentralItemBasic({
  itemId,
  itemName,
  itemDetails,
}: UpdateCentralItemBasicParams) {
  const formData = new FormData();

  formData.append(
    "itemName",
    itemName.trim(),
  );
  formData.append(
    "itemDetails",
    itemDetails.trim(),
  );

  return apiClient.put<ApiResponse<unknown>>(
    `/api/transaction-items/${itemId}`,
    formData,
  );
}

export function getCentralItemByReference(
  referenceCode: string,
) {
  const encodedReference =
    encodeURIComponent(referenceCode.trim());

  return apiClient.get<
    ApiResponse<TransactionItemDetail>
  >(
    `/api/transaction-items/reference/${encodedReference}`,
  );
}


export interface WarehouseReceiveInput {
  finderName?: string;
  itemDetails: string;
  categoryId: number;
  locationId: number;
  itemImages?: File[];
}

export function warehouseReceiveCentralItem(
  input: WarehouseReceiveInput,
) {
  const formData = new FormData();

  if (input.finderName?.trim()) {
    formData.append(
      "finderName",
      input.finderName.trim(),
    );
  }

  formData.append(
    "itemDetails",
    input.itemDetails,
  );

  formData.append(
    "categoryId",
    String(input.categoryId),
  );

  formData.append(
    "locationId",
    String(input.locationId),
  );

  input.itemImages?.forEach((image) => {
    formData.append(
      "itemImages",
      image,
    );
  });

  return apiClient.post<
    ApiResponse<TransactionItemDetail>
  >(
    "/api/transaction-items/warehouse-receive",
    formData,
  );
}

export function handoverToCentral(
  itemId: number,
) {
  return apiClient.put<ApiResponse<unknown>>(
    `/api/transaction-items/${itemId}/handover-to-central`,
  );
}
