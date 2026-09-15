import {
  Boxes,
  House,
  LayoutDashboard,
  MapPin,
  CircleUserRound,
} from "lucide-react";
import { type SidebarNavItem } from "@/types/navigation";

export type UserRole = "user" | "staff" | "admin";

const userHomeItem: SidebarNavItem = {
  label: "หน้าหลัก",
  href: "/dashboard",
  icon: House,
  exact: true,
};

const adminHomeItem: SidebarNavItem = {
  label: "หน้าหลัก",
  href: "/admin/home",
  icon: House,
  exact: true,
};

const userItemsItem: SidebarNavItem = {
  label: "รายการสิ่งของ",
  href: "/items",
  icon: Boxes,
};

const adminItemsItem: SidebarNavItem = {
  label: "รายการสิ่งของ",
  href: "/admin/items",
  icon: Boxes,
};

const storageItem: SidebarNavItem = {
  label: "จุดรับฝากกลาง",
  href: "/admin/storage",
  icon: MapPin,
  exact: true,
};

const adminDashboardItem: SidebarNavItem = {
  label: "แผงควบคุม",
  href: "/admin/dashboard",
  icon: LayoutDashboard,
  exact: true,
};

const userProfileItem: SidebarNavItem = {
  label: "โปรไฟล์",
  href: "/profile",
  icon: CircleUserRound,
};

const adminProfileItem: SidebarNavItem = {
  label: "โปรไฟล์",
  href: "/admin/profile",
  icon: CircleUserRound,
};

export const navigationByRole: Record<
  UserRole,
  SidebarNavItem[]
> = {
  user: [
    userHomeItem,
    userItemsItem,
    userProfileItem,
  ],
  staff: [
    adminHomeItem,
    adminItemsItem,
    storageItem,
    adminProfileItem,
  ],
  admin: [
    adminHomeItem,
    adminItemsItem,
    storageItem,
    adminDashboardItem,
    adminProfileItem,
  ],
};
