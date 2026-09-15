export const dynamic = "force-dynamic";

import { DashboardView } from "@/features/dashboard/DashboardView";

export interface AdminHomePageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function AdminHomePage({
  searchParams,
}: AdminHomePageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  return (
    <DashboardView
      query={query}
      basePath="/admin/items"
      filterAction="/admin/home"
    />
  );
}
