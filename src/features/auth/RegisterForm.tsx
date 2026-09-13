"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ContactRound,
  Eye,
  EyeOff,
  Info,
  LockKeyhole,
  Mail,
  MessageCircle,
  Phone,
  UserPlus,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/services/api-client";
import { register } from "@/services/auth.service";

export function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [lineId, setLineId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError(null);

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (
      phoneNumber &&
      !/^0\d{9}$/.test(phoneNumber)
    ) {
      setError(
        "กรุณากรอกเบอร์โทรศัพท์เป็นตัวเลข 10 หลัก เช่น 0812345678",
      );
      return;
    }

    setLoading(true);

    try {
      await register({
        userEmail: email.trim(),
        userPassword: password,
        userFullName: fullName.trim(),
        userPhoneNumber:
          phoneNumber || undefined,
        userLineId:
          lineId.trim() || undefined,
      });

      router.push("/login");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(
          "ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่อีกครั้ง",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error ? (
        <div
          role="alert"
          className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-brand-purple-soft/45 text-brand-purple">
              <UserPlus
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <h3 className="text-xl font-bold text-foreground">
              สร้างบัญชีผู้ใช้
            </h3>
          </div>

          <div className="space-y-4">
            <Input
              label="อีเมลมหาวิทยาลัย (@bru.ac.th)"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="student@bru.ac.th"
              startIcon={
                <Mail className="size-4" />
              }
              autoComplete="email"
            />

            <Input
              label="รหัสผ่าน"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="กรอกรหัสผ่าน"
              startIcon={
                <LockKeyhole className="size-4" />
              }
              endIcon={
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                  className="inline-flex size-7 items-center justify-center rounded-md text-text-secondary hover:text-brand-purple"
                  aria-label={
                    showPassword
                      ? "ซ่อนรหัสผ่าน"
                      : "แสดงรหัสผ่าน"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              }
              autoComplete="new-password"
            />

            <Input
              label="ยืนยันรหัสผ่าน"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              placeholder="กรอกรหัสผ่านอีกครั้ง"
              startIcon={
                <LockKeyhole className="size-4" />
              }
              endIcon={
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current,
                    )
                  }
                  className="inline-flex size-7 items-center justify-center rounded-md text-text-secondary hover:text-brand-purple"
                  aria-label={
                    showConfirmPassword
                      ? "ซ่อนรหัสผ่าน"
                      : "แสดงรหัสผ่าน"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              }
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            className="mt-6 w-full"
            loading={loading}
          >
            สมัครสมาชิก →
          </Button>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-brand-yellow/30 text-brand-yellow-hover">
              <ContactRound
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <h3 className="text-xl font-bold text-foreground">
              ข้อมูลส่วนตัว
            </h3>
          </div>

          <div className="space-y-4">
            <Input
              label="ชื่อ-นามสกุล"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              placeholder="กรอกชื่อ-นามสกุล"
              startIcon={
                <UserRound className="size-4" />
              }
            />

            <Input
              label="เบอร์โทรศัพท์"
              type="tel"
              value={phoneNumber}
              onChange={(event) => {
                const digits = event.target.value
                  .replace(/[^0-9]/g, "")
                  .slice(0, 10);

                setPhoneNumber(digits);

                if (!digits) {
                  setPhoneError(null);
                } else if (!digits.startsWith("0")) {
                  setPhoneError(
                    "เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0",
                  );
                } else if (digits.length < 10) {
                  setPhoneError(
                    "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก",
                  );
                } else {
                  setPhoneError(null);
                }
              }}
              error={phoneError ?? undefined}
              placeholder="0812345678"
              inputMode="numeric"
              maxLength={10}
              startIcon={
                <Phone className="size-4" />
              }
              autoComplete="tel"
            />

            <Input
              label="LINE ID (ทางเลือก)"
              value={lineId}
              onChange={(event) =>
                setLineId(event.target.value)
              }
              placeholder="line_id_123"
              startIcon={
                <MessageCircle className="size-4" />
              }
            />
          </div>

          <div className="mt-6 flex gap-3 rounded-lg bg-surface-muted p-4 text-sm leading-6 text-text-secondary">
            <Info
              className="mt-0.5 size-5 shrink-0 text-brand-yellow-hover"
              aria-hidden="true"
            />

            <p>
              ข้อมูลนี้จะถูกใช้เพื่อติดต่อท่าน
              ในกรณีที่พบสิ่งของที่ท่านแจ้งหาย
              หรือเพื่อยืนยันตัวตนเมื่อมารับของ
            </p>
          </div>
        </section>
      </div>

      <p className="text-center text-sm text-text-secondary">
        มีบัญชีอยู่แล้ว?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-purple hover:underline"
        >
          เข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
}
