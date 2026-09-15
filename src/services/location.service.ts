import { apiClient } from "@/services/api-client";
import { type ApiResponse } from "@/types/api";
import {
  type Location,
  type LocationRequest,
} from "@/types/location";

export async function getLocations() {
  const response = await apiClient.get<
    ApiResponse<Location[]>
  >("/api/locations");

  return response.content;
}

export async function createLocation(
  payload: LocationRequest,
) {
  return apiClient.post<ApiResponse<unknown>>(
    "/api/locations",
    payload,
  );
}

export async function updateLocation(
  locationId: number,
  payload: LocationRequest,
) {
  return apiClient.put<ApiResponse<unknown>>(
    `/api/locations/${locationId}`,
    payload,
  );
}

export async function deleteLocation(
  locationId: number,
) {
  return apiClient.delete<ApiResponse<unknown>>(
    `/api/locations/${locationId}`,
  );
}
