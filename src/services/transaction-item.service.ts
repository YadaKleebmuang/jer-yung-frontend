import { apiClient } from "@/services/api-client";
import { type ApiResponse, type PaginatedApiResponse } from "@/types/api";
import {
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
