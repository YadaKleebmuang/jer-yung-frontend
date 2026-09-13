"use client";

import {
  AlertTriangle,
  Package,
} from "lucide-react";
import { useState } from "react";

import { QuickActionCard } from "@/features/dashboard/QuickActionCard";
import {
  ItemReportModal,
  type ItemReportType,
} from "@/features/items/ItemReportModal";

export function DashboardQuickActions() {
  const [
    reportType,
    setReportType,
  ] = useState<ItemReportType | null>(
    null,
  );

  return (
    <>
      <QuickActionCard
        title="แจ้งของหาย"
        description="ลงทะเบียนสิ่งของที่คุณทำหาย เพื่อให้ผู้อื่นช่วยตามหา"
        icon={AlertTriangle}
        variant="lost"
        onClick={() =>
          setReportType("LOST")
        }
      />

      <QuickActionCard
        title="แจ้งพบของ"
        description="รายงานสิ่งของที่คุณพบเห็น เพื่อส่งคืนเจ้าของ"
        icon={Package}
        variant="found"
        onClick={() =>
          setReportType("FOUND")
        }
      />

      {reportType && (
        <ItemReportModal
          open
          type={reportType}
          onClose={() =>
            setReportType(null)
          }
        />
      )}
    </>
  );
}
