import { PageContainer } from "@/components/layout/PageContainer";

export default function UserLoading() {
  return (
    <div className="py-8">
      <PageContainer>
        <div
          className="space-y-6"
          aria-busy="true"
          aria-label="กำลังโหลดข้อมูล"
        >
          <div>
            <div className="h-9 w-48 animate-pulse rounded-lg bg-surface-muted" />
            <div className="mt-3 h-5 w-72 max-w-full animate-pulse rounded bg-surface-muted" />
          </div>

          <div className="rounded-2xl bg-surface p-5">
            <div className="h-11 w-full animate-pulse rounded-lg bg-surface-muted" />
          </div>

          <div className="rounded-2xl bg-surface p-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-border"
                  >
                    <div className="aspect-[5/3] animate-pulse bg-surface-muted" />

                    <div className="space-y-3 p-4">
                      <div className="h-5 w-2/3 animate-pulse rounded bg-surface-muted" />
                      <div className="h-4 w-full animate-pulse rounded bg-surface-muted" />
                      <div className="h-4 w-1/2 animate-pulse rounded bg-surface-muted" />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
