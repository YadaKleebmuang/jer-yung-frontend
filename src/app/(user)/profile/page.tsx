import {
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";

export default function ProfilePage() {
  return (
    <div className="py-8">
      <PageContainer>
        <section>
          <h1 className="text-3xl font-bold text-foreground">
            โปรไฟล์ของฉัน
          </h1>

          <p className="mt-2 text-text-secondary">
            จัดการข้อมูลบัญชีและข้อมูลติดต่อของคุณ
          </p>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          {/* Profile summary */}
          <aside className="rounded-2xl bg-surface p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-24 items-center justify-center rounded-full bg-brand-purple/10">
                <UserRound
                  className="size-12 text-brand-purple"
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-5 text-xl font-bold text-foreground">
                ข้อมูลผู้ใช้
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                บัญชี Jer-Yung
              </p>
            </div>

            <div className="mt-7 border-t border-border pt-6">
              <div className="flex items-center gap-3 rounded-xl bg-surface-muted p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white">
                  <ShieldCheck
                    className="size-5 text-brand-purple"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    สถานะบัญชี
                  </p>

                  <p className="mt-0.5 text-xs text-text-secondary">
                    ผู้ใช้งานระบบ
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Personal information */}
          <section className="rounded-2xl bg-surface p-6 lg:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  ข้อมูลส่วนตัว
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  ข้อมูลที่ใช้สำหรับบัญชีและการติดต่อ
                </p>
              </div>

              <button
                type="button"
                disabled
                title="รอเชื่อม API ข้อมูลผู้ใช้"
                className="rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-semibold text-white opacity-50"
              >
                แก้ไขข้อมูล
              </button>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="profile-name"
                  className="text-sm font-semibold text-foreground"
                >
                  ชื่อ-นามสกุล
                </label>

                <div className="relative mt-2">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-text-secondary" />

                  <input
                    id="profile-name"
                    type="text"
                    disabled
                    placeholder="รอข้อมูลจากบัญชีผู้ใช้"
                    className="h-12 w-full rounded-lg border border-border bg-surface-muted pl-11 pr-4 text-sm text-text-secondary"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="profile-email"
                  className="text-sm font-semibold text-foreground"
                >
                  อีเมล
                </label>

                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-text-secondary" />

                  <input
                    id="profile-email"
                    type="email"
                    disabled
                    placeholder="รอข้อมูลจากบัญชีผู้ใช้"
                    className="h-12 w-full rounded-lg border border-border bg-surface-muted pl-11 pr-4 text-sm text-text-secondary"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="profile-phone"
                  className="text-sm font-semibold text-foreground"
                >
                  เบอร์โทรศัพท์
                </label>

                <div className="relative mt-2">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-text-secondary" />

                  <input
                    id="profile-phone"
                    type="tel"
                    disabled
                    placeholder="ยังไม่มีข้อมูล"
                    className="h-12 w-full rounded-lg border border-border bg-surface-muted pl-11 pr-4 text-sm text-text-secondary"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="profile-line"
                  className="text-sm font-semibold text-foreground"
                >
                  LINE ID
                </label>

                <div className="relative mt-2">
                  <MessageCircle className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-text-secondary" />

                  <input
                    id="profile-line"
                    type="text"
                    disabled
                    placeholder="ยังไม่มีข้อมูล"
                    className="h-12 w-full rounded-lg border border-border bg-surface-muted pl-11 pr-4 text-sm text-text-secondary"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-dashed border-brand-purple/25 bg-brand-purple/5 p-4">
              <p className="text-sm font-medium text-brand-purple">
                ข้อมูลโปรไฟล์จะเชื่อมกับบัญชีผู้ใช้โดยอัตโนมัติ
                เมื่อ Backend รองรับ API ข้อมูลผู้ใช้ปัจจุบัน
              </p>
            </div>
          </section>
        </div>
      </PageContainer>
    </div>
  );
}
