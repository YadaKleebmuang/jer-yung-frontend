import { apiClient } from "@/services/api-client";
import { type ApiResponse } from "@/types/api";

export interface AdminDashboardStats {
  pendingCount: number;
  inCenterCount: number;
  foundedCount: number;
  totalCount: number;
}

export interface AdminDashboardWeeklyItem {
  day: string;
  lost_count: number;
  found_count: number;
}

export function getAdminDashboardStats() {
  return apiClient.get<
    ApiResponse<AdminDashboardStats>
  >("/api/dashboard/stats");
}

export function getAdminDashboardWeekly() {
  return apiClient.get<
    ApiResponse<AdminDashboardWeeklyItem[]>
  >("/api/dashboard/stats/weekly");
}
