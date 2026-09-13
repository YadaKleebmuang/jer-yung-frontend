"use client";

import {
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";

export interface UserErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function UserError({
  reset,
}: UserErrorProps) {
  return (
    <div className="py-8">
      <PageContainer>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl bg-surface p-8 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle
                className="size-8 text-red-500"
                aria-hidden="true"
              />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-foreground">
              ไม่สามารถโหลดข้อมูลได้
            </h1>

            <p className="mt-3 text-sm leading-6 text-text-secondary">
              เกิดข้อผิดพลาดระหว่างการเชื่อมต่อข้อมูล
              กรุณาลองใหม่อีกครั้ง
            </p>

            <button
              type="button"
              onClick={reset}
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-brand-purple px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <RefreshCw
                className="size-4"
                aria-hidden="true"
              />
              ลองใหม่อีกครั้ง
            </button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
