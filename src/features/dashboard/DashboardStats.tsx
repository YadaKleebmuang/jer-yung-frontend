import {
  AlertTriangle,
  Package,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface DashboardStatsProps {
  lost: number;
  found: number;
}

export function DashboardStats({
  lost,
  found,
}: DashboardStatsProps) {
  return (
    <Card className="min-h-60">
      <h2 className="text-xl font-bold text-foreground">
        สถิติระบบ
      </h2>

      <div className="mt-7 space-y-5">
        <div className="flex items-center gap-4">
          <span className="flex size-11 items-center justify-center rounded-xl bg-danger/10 text-danger">
            <AlertTriangle
              className="size-5"
              aria-hidden="true"
            />
          </span>

          <div>
            <p className="text-sm text-text-secondary">
              รายการของหาย
            </p>

            <p className="text-2xl font-bold text-foreground">
              {lost}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex size-11 items-center justify-center rounded-xl bg-success/20 text-success">
            <Package
              className="size-5"
              aria-hidden="true"
            />
          </span>

          <div>
            <p className="text-sm text-text-secondary">
              รายการพบของ
            </p>

            <p className="text-2xl font-bold text-foreground">
              {found}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
