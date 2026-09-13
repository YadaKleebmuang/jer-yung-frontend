import Link from "next/link";
import {
  FolderCog,
  MapPin,
  PackageSearch,
  Warehouse,
} from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";

export default function AdminDashboardPage() {
  return (
    <div className="py-8">
      <PageContainer>
        {/* Header */}
        <section>
          <h1 className="text-3xl font-bold text-foreground">
            แผงควบคุมผู้ดูแลระบบ
          </h1>

          <p className="mt-2 text-text-secondary">
            ภาพรวมระบบและการจัดการข้อมูล
          </p>
        </section>

        {/* Main overview */}
        <section className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
          {/* Weekly statistics */}
          <article className="rounded-2xl bg-surface p-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                สถิติของหายและพบเจอ
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                ภาพรวมข้อมูลในสัปดาห์นี้
              </p>
            </div>

            <div className="mt-6 flex min-h-[360px] flex-col">
              <div className="flex flex-1 items-center justify-center rounded-xl bg-surface-muted/35">
                <div className="text-center">
                  <PackageSearch
                    className="mx-auto size-12 text-brand-purple/35"
                    aria-hidden="true"
                  />

                  <p className="mt-3 text-sm font-semibold text-foreground">
                    รอข้อมูลสถิติจากระบบ
                  </p>

                  <p className="mt-1 text-xs text-text-secondary">
                    กราฟจะแสดงเมื่อเชื่อม Dashboard API
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-border pt-4 text-xs text-text-secondary">
                <span className="inline-flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-brand-purple" />
                  ของหาย
                </span>

                <span className="inline-flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-brand-yellow" />
                  พบเจอ
                </span>
              </div>
            </div>
          </article>

          {/* Management */}
          <aside className="rounded-2xl bg-surface p-6">
            <h2 className="text-xl font-bold text-foreground">
              จัดการระบบ
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              เมนูสำหรับผู้ดูแลระบบ
            </p>

            <div className="mt-6 space-y-4">
              <Link
                href="/admin/storage"
                className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-surface-muted"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-purple/10">
                  <Warehouse
                    className="size-6 text-brand-purple"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="font-bold text-foreground">
                    จุดรับฝากกลาง
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    จัดการรับฝากและส่งคืนสิ่งของ
                  </p>
                </div>
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-surface-muted"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-yellow/25">
                  <FolderCog
                    className="size-6 text-foreground"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="font-bold text-foreground">
                    จัดการหมวดหมู่
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    เพิ่ม แก้ไข และลบหมวดหมู่สิ่งของ
                  </p>
                </div>
              </Link>

              <Link
                href="/admin/locations"
                className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-surface-muted"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-green-50">
                  <MapPin
                    className="size-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="font-bold text-foreground">
                    จัดการสถานที่
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    จัดการสถานที่สำหรับแจ้งสิ่งของ
                  </p>
                </div>
              </Link>
            </div>
          </aside>
        </section>

        {/* System settings */}
        <section className="mt-6 rounded-2xl bg-surface p-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              การตั้งค่าระบบ
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              จัดการหมวดหมู่และสถานที่รับฝากกลาง
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Categories */}
            <div className="rounded-xl border border-border p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-brand-yellow/25">
                    <FolderCog
                      className="size-5 text-foreground"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-foreground">
                      หมวดหมู่สิ่งของ
                    </h3>

                    <p className="mt-0.5 text-xs text-text-secondary">
                      หมวดหมู่ที่ใช้จำแนกสิ่งของ
                    </p>
                  </div>
                </div>

                <Link
                  href="/admin/categories"
                  className="text-sm font-semibold text-brand-purple"
                >
                  จัดการ
                </Link>
              </div>

              <div className="mt-5 rounded-lg bg-surface-muted px-4 py-5 text-center">
                <p className="text-sm text-text-secondary">
                  รอข้อมูลหมวดหมู่จาก Backend
                </p>
              </div>
            </div>

            {/* Locations */}
            <div className="rounded-xl border border-border p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-green-50">
                    <MapPin
                      className="size-5 text-green-600"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-foreground">
                      จุดรับฝากกลาง / สถานที่
                    </h3>

                    <p className="mt-0.5 text-xs text-text-secondary">
                      สถานที่ที่ใช้ในระบบ
                    </p>
                  </div>
                </div>

                <Link
                  href="/admin/locations"
                  className="text-sm font-semibold text-brand-purple"
                >
                  จัดการ
                </Link>
              </div>

              <div className="mt-5 rounded-lg bg-surface-muted px-4 py-5 text-center">
                <p className="text-sm text-text-secondary">
                  รอข้อมูลสถานที่จาก Backend
                </p>
              </div>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  );
}
