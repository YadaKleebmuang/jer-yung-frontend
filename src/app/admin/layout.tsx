import { type ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { JerYungHeader } from "@/components/layout/JerYungHeader";
import { JerYungSidebar } from "@/components/layout/JerYungSidebar";

export interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <AppShell
      sidebar={
        <JerYungSidebar role="admin" />
      }
      header={<JerYungHeader />}
    >
      {children}
    </AppShell>
  );
}
