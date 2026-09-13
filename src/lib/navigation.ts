import {
  Boxes,
  House,
  LayoutDashboard,
  MapPin,
} from "lucide-react";
import { type SidebarNavItem } from "@/types/navigation";

export type UserRole = "user" | "staff" | "admin";

const homeItem: SidebarNavItem = {
  label: "หน้าหลัก",
  href: "/dashboard",
  icon: House,
  exact: true,
};

const itemsItem: SidebarNavItem = {
  label: "รายการสิ่งของ",
  href: "/items",
  icon: Boxes,
};

const storageItem: SidebarNavItem = {
  label: "จุดรับฝากกลาง",
  href: "/admin/storage",
  icon: MapPin,
};

const adminItem: SidebarNavItem = {
  label: "แผงควบคุม",
  href: "/admin/dashboard",
  icon: LayoutDashboard,
};

export const navigationByRole: Record<
  UserRole,
  SidebarNavItem[]
> = {
  user: [
    homeItem,
    itemsItem,
  ],
  staff: [
    homeItem,
    itemsItem,
    storageItem,
  ],
  admin: [
    homeItem,
    itemsItem,
    storageItem,
    adminItem,
  ],
};
