import { type UserRole } from "@/services/auth.service";

export const AUTH_ROLE_STORAGE_KEY =
  "jeryung-user-role";

export function isUserRole(
  value: string | null,
): value is UserRole {
  return (
    value === "USER" ||
    value === "STAFF" ||
    value === "ADMIN"
  );
}

export function getLandingPathForRole(
  role: UserRole,
) {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "STAFF":
      return "/admin/storage";
    default:
      return "/dashboard";
  }
}
