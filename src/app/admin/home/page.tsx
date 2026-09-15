export const dynamic = "force-dynamic";

import { DashboardView } from "@/features/dashboard/DashboardView";

export default async function AdminHomePage() {

  return (
    <DashboardView
      basePath="/admin/items"
    />
  );
}
