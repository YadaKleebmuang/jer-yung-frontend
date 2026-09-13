import { apiClient } from "@/services/api-client";
import { type PaginatedApiResponse } from "@/types/api";
import { type TransactionItemListItem } from "@/types/transaction-item";

export function getLatestLostItems(
  page = 0,
  limit = 4,
) {
  return apiClient.get<
    PaginatedApiResponse<TransactionItemListItem>
  >(
    `/api/transaction-items/latest/lost?page=${page}&limit=${limit}`,
  );
}

export function getLatestFoundItems(
  page = 0,
  limit = 4,
) {
  return apiClient.get<
    PaginatedApiResponse<TransactionItemListItem>
  >(
    `/api/transaction-items/latest/found?page=${page}&limit=${limit}`,
  );
}
