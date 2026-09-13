import { type ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { JerYungHeader } from "@/components/layout/JerYungHeader";
import { JerYungSidebar } from "@/components/layout/JerYungSidebar";

export interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({
  children,
}: UserLayoutProps) {
  return (
    <AppShell
      sidebar={
        <JerYungSidebar role="user" />
      }
      header={
        <JerYungHeader />
      }
    >
      {children}
    </AppShell>
  );
}
