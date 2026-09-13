import {
  Building2,
  MapPin,
  Plus,
  Search,
} from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";

export default function LocationsPage() {
  return (
    <div className="py-8">
      <PageContainer>
        <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              จัดการสถานที่
            </h1>

            <p className="mt-2 text-text-secondary">
              จัดการสถานที่สำหรับการแจ้งของหายและสิ่งของที่พบ
            </p>
          </div>

          <button
            type="button"
            disabled
            title="รอ API สำหรับดึงรายการสถานที่"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-semibold text-white opacity-60"
          >
            <Plus className="size-4" />
            เพิ่มสถานที่
          </button>
        </section>

        <section className="mt-8 rounded-2xl bg-surface p-5">
          <div className="flex h-11 items-center gap-3 rounded-lg bg-surface-muted px-4">
            <Search
              className="size-5 text-text-secondary"
              aria-hidden="true"
            />

            <input
              type="search"
              disabled
              placeholder="ค้นหาสถานที่..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl bg-surface">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-xl font-bold text-foreground">
              รายการสถานที่
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              สถานที่ทั้งหมดที่ใช้ในระบบ Jer-Yung
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-surface-muted text-sm text-text-secondary">
                <tr>
                  <th className="px-6 py-4 font-medium">
                    ชื่อสถานที่
                  </th>
                  <th className="px-6 py-4 font-medium">
                    จุดรับฝากกลาง
                  </th>
                  <th className="px-6 py-4 font-medium">
                    ชื่อศูนย์กลาง
                  </th>
                  <th className="px-6 py-4 text-right font-medium">
                    จัดการ
                  </th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <div className="relative flex size-16 items-center justify-center rounded-full bg-green-50">
              <MapPin
                className="size-8 text-green-600"
                aria-hidden="true"
              />

              <Building2
                className="absolute -bottom-1 -right-1 size-5 rounded bg-white p-0.5 text-brand-purple"
                aria-hidden="true"
              />
            </div>

            <h3 className="mt-4 font-semibold text-foreground">
              ยังไม่มีรายการสถานที่ที่แสดง
            </h3>

            <p className="mt-2 max-w-md text-sm text-text-secondary">
              รอ Backend รองรับ API สำหรับดึงรายการสถานที่
              แล้วข้อมูลจะถูกแสดงในหน้านี้
            </p>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
