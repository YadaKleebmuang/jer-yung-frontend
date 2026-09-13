import {
  ArrowDownToLine,
  Box,
  CheckCircle2,
  Search,
  Send,
} from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";

export default function StoragePage() {
  return (
    <div className="py-8">
      <PageContainer>
        <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              จุดรับฝากกลาง
            </h1>

            <p className="mt-2 text-text-secondary">
              จัดการสิ่งของที่รับฝากและการส่งคืนให้เจ้าของ
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-lg border border-brand-purple px-4 py-2.5 text-sm font-semibold text-brand-purple opacity-60"
            >
              <ArrowDownToLine className="size-4" />
              รับของเข้าคลัง
            </button>

            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-semibold text-white opacity-60"
            >
              <Send className="size-4" />
              คืนของให้เจ้าของ
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-5 sm:grid-cols-3">
          <article className="rounded-2xl bg-surface p-5">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-brand-purple/10">
                <Box className="size-6 text-brand-purple" />
              </div>

              <div>
                <p className="text-sm text-text-secondary">
                  อยู่ในคลังกลาง
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  —
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl bg-surface p-5">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-brand-yellow/25">
                <ArrowDownToLine className="size-6 text-foreground" />
              </div>

              <div>
                <p className="text-sm text-text-secondary">
                  รอส่งมอบเข้าคลัง
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  —
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl bg-surface p-5">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-green-50">
                <CheckCircle2 className="size-6 text-green-600" />
              </div>

              <div>
                <p className="text-sm text-text-secondary">
                  คืนเจ้าของแล้ว
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  —
                </p>
              </div>
            </div>
          </article>
        </section>

        {/* Search / filters */}
        <section className="mt-6 rounded-2xl bg-surface p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
            <div className="flex h-11 items-center gap-3 rounded-lg bg-surface-muted px-4">
              <Search className="size-5 text-text-secondary" />
              <input
                type="search"
                placeholder="ค้นหาชื่อสิ่งของ..."
                disabled
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </div>

            <select
              disabled
              className="h-11 rounded-lg border border-border bg-surface-muted px-3 text-sm text-text-secondary"
            >
              <option>ทุกหมวดหมู่</option>
            </select>

            <select
              disabled
              className="h-11 rounded-lg border border-border bg-surface-muted px-3 text-sm text-text-secondary"
            >
              <option>ทุกสถานะ</option>
            </select>
          </div>
        </section>

        {/* Item table */}
        <section className="mt-6 overflow-hidden rounded-2xl bg-surface">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-xl font-bold text-foreground">
              รายการสิ่งของในคลัง
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              รายการสิ่งของที่อยู่ภายใต้การดูแลของจุดรับฝากกลาง
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-surface-muted text-sm text-text-secondary">
                <tr>
                  <th className="px-6 py-4 font-medium">
                    สิ่งของ
                  </th>
                  <th className="px-6 py-4 font-medium">
                    รหัสอ้างอิง
                  </th>
                  <th className="px-6 py-4 font-medium">
                    หมวดหมู่
                  </th>
                  <th className="px-6 py-4 font-medium">
                    สถานะ
                  </th>
                  <th className="px-6 py-4 font-medium">
                    วันที่
                  </th>
                  <th className="px-6 py-4 text-right font-medium">
                    จัดการ
                  </th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-brand-purple/10">
              <Box className="size-7 text-brand-purple" />
            </div>

            <h3 className="mt-4 font-semibold text-foreground">
              ยังไม่มีข้อมูลคลังที่แสดง
            </h3>

            <p className="mt-2 max-w-sm text-sm text-text-secondary">
              หน้านี้พร้อมสำหรับเชื่อมข้อมูลคลังกลางจากบัญชี STAFF หรือ ADMIN
            </p>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
