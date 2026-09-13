import { type ReactNode } from "react";

import { AdminAccessShell } from "@/components/layout/AdminAccessShell";

export interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <AdminAccessShell>
      {children}
    </AdminAccessShell>
  );
}
