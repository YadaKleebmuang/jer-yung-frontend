import { PageContainer } from "@/components/layout/PageContainer";

export default function DashboardPage() {
  return (
    <div className="py-8">
      <PageContainer>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h1 className="text-2xl font-bold text-foreground">
            Jer-Yung
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            User layout smoke test
          </p>
        </div>
      </PageContainer>
    </div>
  );
}
