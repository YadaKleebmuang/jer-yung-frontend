import Link from "next/link";
import {
  ArrowLeft,
  PackageSearch,
} from "lucide-react";

export default function ItemNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-surface p-8 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-purple/10">
          <PackageSearch
            className="size-8 text-brand-purple"
            aria-hidden="true"
          />
        </div>

        <p className="mt-6 text-sm font-semibold text-brand-purple">
          404
        </p>

        <h1 className="mt-2 text-2xl font-bold text-foreground">
          ไม่พบรายการสิ่งของ
        </h1>

        <p className="mt-3 text-sm leading-6 text-text-secondary">
          รายการนี้อาจไม่มีอยู่ในระบบ หรืออาจถูกนำออกไปแล้ว
        </p>

        <Link
          href="/items"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-brand-purple px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <ArrowLeft
            className="size-4"
            aria-hidden="true"
          />
          กลับไปยังรายการสิ่งของ
        </Link>
      </div>
    </div>
  );
}
