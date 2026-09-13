import {
  Handshake,
} from "lucide-react";

import { RegisterForm } from "@/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-purple-soft/45 text-brand-purple">
              <Handshake
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <span className="text-2xl font-bold text-brand-purple">
              เจอยัง (Jer-Yung)
            </span>
          </div>

          <p className="text-sm font-medium text-text-secondary">
            มหาวิทยาลัยราชภัฏบุรีรัมย์
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
        <section className="rounded-2xl bg-surface p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brand-purple">
                ยินดีต้อนรับสู่ระบบจัดการของหาย
              </h1>

              <p className="mt-3 text-base text-text-secondary">
                กรุณาสมัครสมาชิกด้วยอีเมล @bru.ac.th
                เพื่อเข้าใช้งานระบบของมหาวิทยาลัยราชภัฏบุรีรัมย์
              </p>
            </div>

            <div className="flex size-28 shrink-0 items-center justify-center rounded-2xl bg-brand-purple-soft text-brand-purple">
              <Handshake
                className="size-14"
                aria-hidden="true"
              />
            </div>
          </div>
        </section>

        <section className="mt-6">
          <RegisterForm />
        </section>
      </div>

      <footer className="mt-8 border-t border-border bg-surface-muted">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="font-semibold text-brand-purple">
              เจอยัง (Jer-Yung)
            </p>

            <p className="mt-1">
              © 2026 มหาวิทยาลัยราชภัฏบุรีรัมย์
              - ระบบจัดการของหาย
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>ติดต่อเรา</span>
            <span>นโยบายความเป็นส่วนตัว</span>
            <span>คู่มือการใช้งาน</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
