import { apiClient } from "@/services/api-client";
import { type ApiResponse, type PaginatedApiResponse } from "@/types/api";
import {
  type CreateTransactionItemInput,
  type TransactionItemListItem,
  type TransactionItemPostType,
} from "@/types/transaction-item";
import { type TransactionItemDetail } from "@/types/transaction-item-detail";

export interface GetTransactionItemsParams {
  type?: TransactionItemPostType;
  keyword?: string;
  page?: number;
  limit?: number;
}

export function getTransactionItems({
  type,
  keyword,
  page = 0,
  limit = 12,
}: GetTransactionItemsParams = {}) {
  const params = new URLSearchParams();

  if (type) {
    params.set("type", type);
  }

  if (keyword?.trim()) {
    params.set("keyword", keyword.trim());
  }

  params.set("page", String(page));
  params.set("limit", String(limit));

  return apiClient.get<
    PaginatedApiResponse<TransactionItemListItem>
  >(
    `/api/transaction-items?${params.toString()}`,
  );
}


export function getTransactionItemById(
  id: number,
) {
  return apiClient.get<
    ApiResponse<TransactionItemDetail>
  >(
    `/api/transaction-items/${id}`,
  );
}

export function createTransactionItem(
  input: CreateTransactionItemInput,
) {
  const formData = new FormData();

  formData.append(
    "locationId",
    String(input.locationId),
  );

  formData.append(
    "categoryId",
    String(input.categoryId),
  );

  formData.append(
    "transactionItemsPostType",
    input.transactionItemsPostType,
  );

  formData.append(
    "transactionItemsName",
    input.transactionItemsName,
  );

  formData.append(
    "transactionItemsLocationDetails",
    input.transactionItemsLocationDetails,
  );

  if (input.transactionItemsStorageType) {
    formData.append(
      "transactionItemsStorageType",
      input.transactionItemsStorageType,
    );
  }

  input.images?.forEach((image) => {
    formData.append("images", image);
  });

  return apiClient.post<ApiResponse<unknown>>(
    "/api/transaction-items",
    formData,
  );
}
