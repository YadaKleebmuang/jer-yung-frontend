import { PageContainer } from "@/components/layout/PageContainer";
import { DashboardInteractive } from "@/features/dashboard/DashboardInteractive";
import { DashboardStats } from "@/features/dashboard/DashboardStats";
import { DashboardQuickActions } from "@/features/dashboard/DashboardQuickActions";
import {
  getLatestFoundItems,
  getLatestLostItems,
} from "@/services/dashboard.service";

export interface DashboardViewProps {
  basePath?: string;
}

export async function DashboardView({
  basePath = "/items",
}: DashboardViewProps) {
  const [
    latestLostResponse,
    latestFoundResponse,
  ] = await Promise.all([
    getLatestLostItems(),
    getLatestFoundItems(),
  ]);

  const lostItems = latestLostResponse.content.content;
  const foundItems = latestFoundResponse.content.content;

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

        <DashboardInteractive
          lostItems={lostItems}
          foundItems={foundItems}
          basePath={basePath}
        />
      </PageContainer>
    </div>
  );
}
