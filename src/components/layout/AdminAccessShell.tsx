"use client";

import {
  type ReactNode,
  useEffect,
  useSyncExternalStore,
} from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { JerYungHeader } from "@/components/layout/JerYungHeader";
import { JerYungSidebar } from "@/components/layout/JerYungSidebar";
import {
  AUTH_ROLE_STORAGE_KEY,
  isUserRole,
} from "@/lib/auth-session";
import { type UserRole } from "@/services/auth.service";

export interface AdminAccessShellProps {
  children: ReactNode;
}

type RoleSnapshot =
  | UserRole
  | "MISSING"
  | "LOADING";

function subscribeRole(
  callback: () => void,
) {
  window.addEventListener(
    "storage",
    callback,
  );

  return () => {
    window.removeEventListener(
      "storage",
      callback,
    );
  };
}

function getRoleSnapshot(): RoleSnapshot {
  const storedRole =
    window.localStorage.getItem(
      AUTH_ROLE_STORAGE_KEY,
    );

  return isUserRole(storedRole)
    ? storedRole
    : "MISSING";
}

function getServerRoleSnapshot(): RoleSnapshot {
  return "LOADING";
}

function isAdminOnlyPath(
  pathname: string,
) {
  return (
    pathname.startsWith(
      "/admin/dashboard",
    ) ||
    pathname.startsWith(
      "/admin/categories",
    ) ||
    pathname.startsWith(
      "/admin/locations",
    )
  );
}

export function AdminAccessShell({
  children,
}: AdminAccessShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const role = useSyncExternalStore(
    subscribeRole,
    getRoleSnapshot,
    getServerRoleSnapshot,
  );

  useEffect(() => {
    if (role === "LOADING") {
      return;
    }

    if (role === "MISSING") {
      router.replace("/login");
      return;
    }

    if (role === "USER") {
      router.replace("/dashboard");
      return;
    }

    if (
      role === "STAFF" &&
      isAdminOnlyPath(pathname)
    ) {
      router.replace("/admin/storage");
    }
  }, [pathname, role, router]);

  const canRender =
    role === "ADMIN" ||
    (role === "STAFF" &&
      !isAdminOnlyPath(pathname));

  if (!canRender) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-text-secondary">
          กำลังตรวจสอบสิทธิ์...
        </p>
      </div>
    );
  }

  return (
    <AppShell
      sidebar={
        <JerYungSidebar
          role={
            role === "ADMIN"
              ? "admin"
              : "staff"
          }
        />
      }
      header={
        <JerYungHeader
          profileHref="/admin/profile"
        />
      }
    >
      {children}
    </AppShell>
  );
}
