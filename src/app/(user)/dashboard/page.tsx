export const dynamic = "force-dynamic";

import { PageContainer } from "@/components/layout/PageContainer";
import { DashboardFilterBar } from "@/features/dashboard/DashboardFilterBar";
import { DashboardStats } from "@/features/dashboard/DashboardStats";
import { LatestItemsTabs } from "@/features/dashboard/LatestItemsTabs";
import { DashboardQuickActions } from "@/features/dashboard/DashboardQuickActions";
import {
  getLatestFoundItems,
  getLatestLostItems,
} from "@/services/dashboard.service";
import { getTransactionItems } from "@/services/transaction-item.service";

export interface DashboardPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const [
    latestLostResponse,
    latestFoundResponse,
  ] = await Promise.all([
    getLatestLostItems(),
    getLatestFoundItems(),
  ]);

  let lostItems =
    latestLostResponse.content.content;

  let foundItems =
    latestFoundResponse.content.content;

  if (query) {
    const [
      searchedLostResponse,
      searchedFoundResponse,
    ] = await Promise.all([
      getTransactionItems({
        type: "LOST",
        keyword: query,
        page: 0,
        limit: 4,
      }),
      getTransactionItems({
        type: "FOUND",
        keyword: query,
        page: 0,
        limit: 4,
      }),
    ]);

    lostItems =
      searchedLostResponse.content.content;

    foundItems =
      searchedFoundResponse.content.content;
  }

  return (
    <div className="py-8">
      <PageContainer>
        <section>
          <h1 className="text-3xl font-bold text-foreground">
            ยินดีต้อนรับ
          </h1>

          <p className="mt-2 text-text-secondary">
            ระบบจัดการของหาย มหาวิทยาลัยราชภัฏบุรีรัมย์
          </p>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr_0.9fr]">
          <DashboardQuickActions />

          <DashboardStats
            lost={latestLostResponse.content.totalElements}
            found={latestFoundResponse.content.totalElements}
          />
        </section>

        <DashboardFilterBar defaultQuery={query} />

        <LatestItemsTabs
          lostItems={lostItems}
          foundItems={foundItems}
        />
     </PageContainer>
    </div>
  );
}
