"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { ApiError } from "@/services/api-client";
import {
  getCurrentUser,
  updateCurrentUser,
  type CurrentUser,
  type UserRole,
} from "@/services/auth.service";

function getRoleLabel(role: UserRole) {
  switch (role) {
    case "ADMIN":
      return "ผู้ดูแลระบบ";
    case "STAFF":
      return "เจ้าหน้าที่";
    case "USER":
      return "ผู้ใช้งานระบบ";
  }
}

export default function ProfilePage() {
  const [user, setUser] =
    useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] =
    useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] =
    useState<string | null>(null);
  const [form, setForm] = useState({
    userFullName: "",
    userPhoneNumber: "",
    userLineId: "",
  });

  useEffect(() => {
    let cancelled = false;

    getCurrentUser()
      .then((response) => {
        if (cancelled) return;

        setUser(response.content);
        setForm({
          userFullName:
            response.content.userFullName,
          userPhoneNumber:
            response.content.userPhoneNumber ?? "",
          userLineId:
            response.content.userLineId ?? "",
        });
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;

        setUser(null);
        setError(
          err instanceof ApiError
            ? err.message
            : "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function startEditing() {
    if (!user) return;

    setForm({
      userFullName: user.userFullName,
      userPhoneNumber:
        user.userPhoneNumber ?? "",
      userLineId: user.userLineId ?? "",
    });
    setSaveError(null);
    setSaveSuccess(null);
    setEditing(true);
  }

  function cancelEditing() {
    if (user) {
      setForm({
        userFullName: user.userFullName,
        userPhoneNumber:
          user.userPhoneNumber ?? "",
        userLineId: user.userLineId ?? "",
      });
    }

    setSaveError(null);
    setEditing(false);
  }

  async function saveProfile() {
    const fullName = form.userFullName.trim();

    if (!fullName) {
      setSaveError("กรุณากรอกชื่อ-นามสกุล");
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(null);

      const response = await updateCurrentUser({
        userFullName: fullName,
        userPhoneNumber:
          form.userPhoneNumber.trim(),
        userLineId: form.userLineId.trim(),
      });

      setUser(response.content);
      setForm({
        userFullName:
          response.content.userFullName,
        userPhoneNumber:
          response.content.userPhoneNumber ?? "",
        userLineId:
          response.content.userLineId ?? "",
      });
      setEditing(false);
      setSaveSuccess(
        "บันทึกข้อมูลเรียบร้อยแล้ว",
      );
    } catch (err) {
      setSaveError(
        err instanceof ApiError
          ? err.message
          : "ไม่สามารถบันทึกข้อมูลได้",
      );
    } finally {
      setSaving(false);
    }
  }

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

        {error ? (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          >
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="rounded-2xl bg-surface p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-24 items-center justify-center rounded-full bg-brand-purple/10">
                <UserRound
                  className="size-12 text-brand-purple"
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-5 text-xl font-bold text-foreground">
                {loading
                  ? "กำลังโหลด..."
                  : user?.userFullName ??
                    "ข้อมูลผู้ใช้"}
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                {user?.userEmail ?? "บัญชี Jer-Yung"}
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
                    {user
                      ? getRoleLabel(user.userRole)
                      : "กำลังโหลดข้อมูล"}
                  </p>
                </div>
              </div>
            </div>
          </aside>

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

              {editing ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="rounded-lg bg-surface-muted px-4 py-2.5 text-sm font-semibold text-foreground disabled:opacity-50"
                  >
                    ยกเลิก
                  </button>

                  <button
                    type="button"
                    onClick={() => void saveProfile()}
                    disabled={saving}
                    className="rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {saving
                      ? "กำลังบันทึก..."
                      : "บันทึก"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startEditing}
                  disabled={loading || !user}
                  className="rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  แก้ไขข้อมูล
                </button>
              )}
            </div>

            {saveError ? (
              <p
                role="alert"
                className="mt-5 text-sm text-danger"
              >
                {saveError}
              </p>
            ) : null}

            {saveSuccess ? (
              <p className="mt-5 text-sm font-medium text-green-600">
                {saveSuccess}
              </p>
            ) : null}

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
                    value={
                      editing
                        ? form.userFullName
                        : user?.userFullName ?? ""
                    }
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        userFullName: event.target.value,
                      }))
                    }
                    readOnly={!editing}
                    disabled={!editing || saving}
                    placeholder={
                      loading
                        ? "กำลังโหลด..."
                        : "ไม่มีข้อมูล"
                    }
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
                    value={user?.userEmail ?? ""}
                    readOnly
                    disabled
                    placeholder={
                      loading
                        ? "กำลังโหลด..."
                        : "ไม่มีข้อมูล"
                    }
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
                    value={
                      editing
                        ? form.userPhoneNumber
                        : user?.userPhoneNumber ?? ""
                    }
                    onChange={(event) => {
                      const sanitized = event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                      setForm((current) => ({
                        ...current,
                        userPhoneNumber: sanitized,
                      }));
                    }}
                    readOnly={!editing}
                    disabled={!editing || saving}
                    placeholder="ยังไม่มีข้อมูล"
                    inputMode="numeric"
                    maxLength={10}
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
                    value={
                      editing
                        ? form.userLineId
                        : user?.userLineId ?? ""
                    }
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        userLineId: event.target.value,
                      }))
                    }
                    readOnly={!editing}
                    disabled={!editing || saving}
                    placeholder="ยังไม่มีข้อมูล"
                    className="h-12 w-full rounded-lg border border-border bg-surface-muted pl-11 pr-4 text-sm text-text-secondary"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </PageContainer>
    </div>
  );
}
