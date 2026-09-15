import { apiClient } from "@/services/api-client";
import { type ApiResponse } from "@/types/api";
import {
  type Category,
  type CategoryRequest,
} from "@/types/category";

export async function getCategories() {
  const response = await apiClient.get<
    ApiResponse<Category[]>
  >("/api/categories");

  return response.content;
}

export async function createCategory(
  payload: CategoryRequest,
) {
  return apiClient.post<ApiResponse<unknown>>(
    "/api/categories",
    payload,
  );
}

export async function updateCategory(
  categoryId: number,
  payload: CategoryRequest,
) {
  return apiClient.put<ApiResponse<unknown>>(
    `/api/categories/${categoryId}`,
    payload,
  );
}

export async function deleteCategory(
  categoryId: number,
) {
  return apiClient.delete<ApiResponse<unknown>>(
    `/api/categories/${categoryId}`,
  );
}
