export const dynamic = "force-dynamic";

import { DashboardView } from "@/features/dashboard/DashboardView";

export default async function DashboardPage() {

  return (
    <DashboardView
      basePath="/items"
    />
  );
}
