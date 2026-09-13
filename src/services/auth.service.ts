import { apiClient } from "@/services/api-client";
import { type ApiResponse } from "@/types/api";

export type UserRole = "USER" | "STAFF" | "ADMIN";

export interface LoginRequest {
  userEmail: string;
  userPassword: string;
}

export interface LoginUser {
  token: string;
  userId: number;
  userEmail: string;
  userFullName: string;
  userLineId: string | null;
  userPhoneNumber: string | null;
  userRole: UserRole;
}

export type LoginResponse = ApiResponse<LoginUser>;

export function login(payload: LoginRequest) {
  return apiClient.post<LoginResponse>(
    "/api/auth/users/login",
    payload,
  );
}

export interface RegisterRequest {
  userEmail: string;
  userPassword: string;
  userFullName: string;
  userPhoneNumber?: string;
  userLineId?: string;
}

export type RegisterResponse =
  ApiResponse<string>;

export function register(
  payload: RegisterRequest,
) {
  return apiClient.post<RegisterResponse>(
    "/api/auth/users/register",
    payload,
  );
}
