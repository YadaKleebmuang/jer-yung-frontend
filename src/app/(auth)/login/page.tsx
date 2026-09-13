import {
  CircleCheck,
  Handshake,
  Search,
} from "lucide-react";

import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
        <section className="grid w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-sm lg:grid-cols-[1.08fr_0.92fr]">
          <div className="hidden min-h-[560px] flex-col justify-center bg-gradient-to-br from-brand-purple-soft/45 via-white to-brand-yellow/20 px-16 py-14 lg:flex">
            <div className="max-w-md">
              <h1 className="text-4xl font-bold leading-tight text-brand-purple">
                เจอยัง
                <span className="block">
                  (Jer-Yung)
                </span>
              </h1>

              <p className="mt-7 text-base leading-8 text-text-secondary">
                ระบบจัดการของหาย มหาวิทยาลัยราชภัฏบุรีรัมย์
                ช่วยให้คุณค้นหาและส่งคืนสิ่งของที่สูญหาย
                ได้อย่างง่ายดายและมีประสิทธิภาพ
              </p>

              <div className="mt-8 flex items-center gap-5">
                <span className="flex size-11 items-center justify-center rounded-full bg-white text-brand-purple shadow-sm">
                  <Search
                    className="size-6"
                    aria-hidden="true"
                  />
                </span>

                <span className="flex size-11 items-center justify-center rounded-full bg-brand-yellow/30 text-brand-yellow-hover shadow-sm">
                  <Handshake
                    className="size-6"
                    aria-hidden="true"
                  />
                </span>

                <span className="flex size-11 items-center justify-center rounded-full bg-success/20 text-success shadow-sm">
                  <CircleCheck
                    className="size-6"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="flex min-h-[560px] items-center justify-center px-8 py-12 sm:px-12 lg:px-14">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-foreground">
                  เข้าสู่ระบบ
                </h2>

                <p className="mt-2 text-sm text-text-secondary">
                  กรุณากรอกอีเมลและรหัสผ่านของคุณ
                </p>
              </div>

              <LoginForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
