"use client";

import Link from "next/link";
import {
  FolderCog,
  MapPin,
  PackageSearch,
  Warehouse,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { PageContainer } from "@/components/layout/PageContainer";
import { getAdminDashboardStats, getAdminDashboardWeekly, type AdminDashboardStats, type AdminDashboardWeeklyItem } from "@/services/admin-dashboard.service";
import { ApiError } from "@/services/api-client";
import { getCategories } from "@/services/category.service";
import { getLocations } from "@/services/location.service";
import { type Category } from "@/types/category";
import { type Location } from "@/types/location";

function formatDay(value: string) {
  const normalized = value.trim();

  const isoDatePattern =
    /^\d{4}-\d{2}-\d{2}$/;

  if (!isoDatePattern.test(normalized)) {
    return normalized;
  }

  const date = new Date(
    `${normalized}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return normalized;
  }

  return new Intl.DateTimeFormat(
    "th-TH",
    {
      weekday: "short",
    },
  ).format(date);
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [weekly, setWeekly] = useState<AdminDashboardWeeklyItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const [
          statsResponse,
          weeklyResponse,
          categoriesData,
          locationsData,
        ] = await Promise.all([
          getAdminDashboardStats(),
          getAdminDashboardWeekly(),
          getCategories().catch(() => []),
          getLocations().catch(() => []),
        ]);

        if (cancelled) {
          return;
        }

        setStats(statsResponse.content);
        setWeekly(weeklyResponse.content);
        setCategories(categoriesData);
        setLocations(locationsData);
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (
          error instanceof ApiError &&
          error.status === 403
        ) {
          setErrorMessage(
            "บัญชีนี้ไม่มีสิทธิ์เข้าถึงข้อมูลสำหรับผู้ดูแลระบบ",
          );
        } else {
          setErrorMessage(
            "ไม่สามารถโหลดข้อมูล Dashboard ได้",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const maxWeeklyCount = Math.max(
    1,
    ...weekly.flatMap((item) => [
      item.lost_count,
      item.found_count,
    ]),
  );

  return (
    <div className="py-8">
      <PageContainer>
        <section>
          <h1 className="text-3xl font-bold text-foreground">
            แผงควบคุมผู้ดูแลระบบ
          </h1>

          <p className="mt-2 text-text-secondary">
            ภาพรวมระบบและการจัดการข้อมูล
          </p>
        </section>

        {errorMessage && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
          <article className="rounded-2xl bg-surface p-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                สถิติของหายและพบเจอ
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                ภาพรวมข้อมูลในสัปดาห์นี้
              </p>
            </div>

            {loading ? (
              <div className="mt-6 flex min-h-[360px] items-center justify-center rounded-xl bg-surface-muted/40">
                <p className="text-sm text-text-secondary">
                  กำลังโหลดข้อมูล...
                </p>
              </div>
            ) : weekly.length > 0 ? (
              <div className="mt-8">
                <div className="flex h-72 items-end gap-4 border-b border-border px-2">
                  {weekly.map((item) => (
                    <div
                      key={item.day}
                      className="flex min-w-0 flex-1 flex-col items-center"
                    >
                      <div className="flex h-56 w-full items-end justify-center gap-1.5">
                        <div
                          title={`ของหาย ${item.lost_count}`}
                          className="w-5 rounded-t bg-brand-purple"
                          style={{
                            height: `${Math.max(
                              6,
                              (item.lost_count /
                                maxWeeklyCount) *
                                100,
                            )}%`,
                          }}
                        />

                        <div
                          title={`พบเจอ ${item.found_count}`}
                          className="w-5 rounded-t bg-brand-yellow"
                          style={{
                            height: `${Math.max(
                              6,
                              (item.found_count /
                                maxWeeklyCount) *
                                100,
                            )}%`,
                          }}
                        />
                      </div>

                      <span className="mt-3 text-xs text-text-secondary">
                        {formatDay(item.day)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-text-secondary">
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
            ) : (
              <div className="mt-6 flex min-h-[360px] items-center justify-center rounded-xl bg-surface-muted/35">
                <div className="text-center">
                  <PackageSearch
                    className="mx-auto size-12 text-brand-purple/35"
                    aria-hidden="true"
                  />

                  <p className="mt-3 text-sm font-semibold text-foreground">
                    ยังไม่มีข้อมูลสถิติ
                  </p>
                </div>
              </div>
            )}
          </article>

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
                  <Warehouse className="size-6 text-brand-purple" />
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
                  <FolderCog className="size-6 text-foreground" />
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
                  <MapPin className="size-6 text-green-600" />
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
            <div className="rounded-xl border border-border p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-foreground">
                    หมวดหมู่สิ่งของ
                  </h3>

                  <p className="mt-1 text-xs text-text-secondary">
                    จัดการหมวดหมู่ที่ใช้จำแนกสิ่งของ
                  </p>
                </div>

                <Link
                  href="/admin/categories"
                  className="text-sm font-semibold text-brand-purple"
                >
                  จัดการ
                </Link>
              </div>

              <div className="mt-5 rounded-lg bg-surface-muted p-4">
                {loading ? (
                  <p className="text-sm text-text-secondary">กำลังโหลด...</p>
                ) : categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {categories.map((c) => (
                      <span key={c.categoryId} className="rounded-md bg-brand-purple/10 px-2 py-1 text-[11px] font-medium text-brand-purple">
                        {c.categoryName}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary">
                    ยังไม่มีหมวดหมู่
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-foreground">
                    จุดรับฝากกลาง / สถานที่
                  </h3>

                  <p className="mt-1 text-xs text-text-secondary">
                    จัดการสถานที่ที่ใช้ในระบบ
                  </p>
                </div>

                <Link
                  href="/admin/locations"
                  className="text-sm font-semibold text-brand-purple"
                >
                  จัดการ
                </Link>
              </div>

              <div className="mt-5 rounded-lg bg-surface-muted p-4">
                {loading ? (
                  <p className="text-sm text-text-secondary">กำลังโหลด...</p>
                ) : locations.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {locations.map((l) => (
                      <span key={l.locationId} className="rounded-md bg-brand-yellow/30 px-2 py-1 text-[11px] font-medium text-foreground">
                        {l.locationName}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary">
                    ยังไม่มีสถานที่
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["กำลังตามหา", stats?.pendingCount],
            ["อยู่คลังกลาง", stats?.inCenterCount],
            ["พบของแล้ว", stats?.foundedCount],
            ["รายการทั้งหมด", stats?.totalCount],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-xl bg-surface p-4"
            >
              <p className="text-xs text-text-secondary">
                {label}
              </p>

              <p className="mt-1 text-xl font-bold text-foreground">
                {loading
                  ? "…"
                  : value ?? "—"}
              </p>
            </div>
          ))}
        </section>
      </PageContainer>
    </div>
  );
}
