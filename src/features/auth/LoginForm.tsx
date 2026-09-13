"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/services/api-client";
import { login } from "@/services/auth.service";

const REMEMBERED_EMAIL_KEY =
  "jeryung-remembered-email";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const normalizedEmail = email.trim();

      await login({
        userEmail: normalizedEmail,
        userPassword: password,
      });

      if (rememberMe) {
        window.localStorage.setItem(
          REMEMBERED_EMAIL_KEY,
          normalizedEmail,
        );
      } else {
        window.localStorage.removeItem(
          REMEMBERED_EMAIL_KEY,
        );
      }

      router.push("/dashboard");
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
      <Input
        label="อีเมล"
        type="email"
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
        placeholder="example@bru.ac.th"
        startIcon={<Mail className="size-4" />}
        autoComplete="email"
      />

      <Input
        label="รหัสผ่าน"
        type={showPassword ? "text" : "password"}
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
            className="inline-flex size-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:text-brand-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
            aria-label={
              showPassword
                ? "ซ่อนรหัสผ่าน"
                : "แสดงรหัสผ่าน"
            }
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff
                className="size-4"
                aria-hidden="true"
              />
            ) : (
              <Eye
                className="size-4"
                aria-hidden="true"
              />
            )}
          </button>
        }
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-text-secondary">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) =>
              setRememberMe(event.target.checked)
            }
            className="size-4 rounded border-border-strong accent-brand-purple"
          />

          <span>จดจำฉันไว้ในระบบ</span>
        </label>

        <span
          className="cursor-not-allowed font-medium text-brand-purple/50"
          title="ยังไม่เปิดใช้งาน"
          aria-disabled="true"
        >
          ลืมรหัสผ่าน?
        </span>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </div>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        loading={loading}
      >
        เข้าสู่ระบบ
      </Button>

      <p className="text-center text-sm text-text-secondary">
        ยังไม่มีบัญชีใช่หรือไม่?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand-purple hover:underline"
        >
          สมัครสมาชิก
        </Link>
      </p>
    </form>
  );
}
