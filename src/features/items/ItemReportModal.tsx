"use client";

import {
  ImagePlus,
  MapPin,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  useEffect,
  useState,
} from "react";

import { cn } from "@/lib/utils";

export type ItemReportType =
  | "LOST"
  | "FOUND";

export interface ItemReportModalProps {
  open: boolean;
  type: ItemReportType;
  onClose: () => void;
}

interface SelectedImage {
  file: File;
  previewUrl: string;
}

const MAX_IMAGES = 5;

export function ItemReportModal({
  open,
  type,
  onClose,
}: ItemReportModalProps) {
  const [activeType, setActiveType] =
    useState<ItemReportType>(type);

  const [images, setImages] = useState<
    SelectedImage[]
  >([]);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(
          image.previewUrl,
        );
      });
    };
  }, [images]);

  if (!open) {
    return null;
  }

  const isLost =
    activeType === "LOST";

  function handleImages(
    files: FileList | null,
  ) {
    if (!files) {
      return;
    }

    const remaining =
      MAX_IMAGES - images.length;

    if (remaining <= 0) {
      return;
    }

    const nextImages = Array.from(files)
      .slice(0, remaining)
      .map((file) => ({
        file,
        previewUrl:
          URL.createObjectURL(file),
      }));

    setImages((current) => [
      ...current,
      ...nextImages,
    ]);
  }

  function removeImage(index: number) {
    setImages((current) => {
      const target = current[index];

      if (target) {
        URL.revokeObjectURL(
          target.previewUrl,
        );
      }

      return current.filter(
        (_, currentIndex) =>
          currentIndex !== index,
      );
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <h2
          id="report-modal-title"
          className="sr-only"
        >
          แจ้งของหายหรือแจ้งเจอของ
        </h2>

        {/* Tabs */}
        <div className="grid grid-cols-2 border-b border-border">
          <button
            type="button"
            onClick={() =>
              setActiveType("LOST")
            }
            className={cn(
              "min-h-16 text-sm font-semibold transition-colors",
              isLost
                ? "bg-brand-purple text-white"
                : "bg-surface-muted text-text-secondary",
            )}
          >
            แจ้งของหาย
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveType("FOUND")
            }
            className={cn(
              "min-h-16 text-sm font-semibold transition-colors",
              !isLost
                ? "bg-brand-yellow text-foreground"
                : "bg-surface-muted text-text-secondary",
            )}
          >
            แจ้งเจอของ
          </button>
        </div>

        <form
          className="overflow-y-auto"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="space-y-6 p-6">
            {/* Images */}
            <section>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-foreground">
                  รูปภาพสิ่งของ
                  {isLost
                    ? "ที่หาย"
                    : "ที่พบ"}
                </p>

                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    isLost
                      ? "bg-brand-purple/10 text-brand-purple"
                      : "bg-brand-yellow/25 text-foreground",
                  )}
                >
                  เลือกแล้ว {images.length}/5 รูป
                </span>
              </div>

              <div className="mt-3 rounded-lg bg-surface-muted p-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {images.map(
                    (image, index) => (
                      <div
                        key={`${image.file.name}-${index}`}
                        className="relative aspect-square overflow-hidden rounded-lg border border-border bg-white"
                      >
                        <Image
                          src={
                            image.previewUrl
                          }
                          alt={`รูปที่ ${index + 1}`}
                          fill
                          unoptimized
                          className="object-cover"
                        />

                        <span
                          className={cn(
                            "absolute left-2 top-2 rounded px-2 py-1 text-[10px] font-semibold",
                            isLost
                              ? "bg-brand-purple text-white"
                              : "bg-brand-yellow text-foreground",
                          )}
                        >
                          รูปที่ {index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(
                              index,
                            )
                          }
                          className="absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-full bg-black/60 text-white"
                          aria-label={`ลบรูปที่ ${index + 1}`}
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ),
                  )}

                  {images.length <
                    MAX_IMAGES && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-purple/30 bg-white text-center">
                      <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand-purple/10">
                        <ImagePlus className="size-5 text-brand-purple" />
                      </span>

                      <span className="mt-2 text-xs font-semibold text-foreground">
                        เพิ่มรูปภาพ
                      </span>

                      <span className="mt-1 text-[10px] text-text-secondary">
                        สูงสุด 5 รูป
                      </span>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="sr-only"
                        onChange={(event) => {
                          handleImages(
                            event.target
                              .files,
                          );

                          event.target.value =
                            "";
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </section>

            {isLost ? (
              <>
                {/* LOST */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="lost-name"
                      className="text-sm font-semibold text-foreground"
                    >
                      ชื่อสิ่งของ
                    </label>

                    <input
                      id="lost-name"
                      type="text"
                      placeholder="เช่น กระเป๋าสตางค์สีดำ"
                      className="mt-2 h-11 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lost-category"
                      className="text-sm font-semibold text-foreground"
                    >
                      หมวดหมู่
                    </label>

                    <select
                      id="lost-category"
                      disabled
                      className="mt-2 h-11 w-full rounded-md border border-border bg-surface-muted px-3 text-sm text-text-secondary"
                    >
                      <option>
                        เลือกหมวดหมู่
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="lost-date"
                      className="text-sm font-semibold text-foreground"
                    >
                      วันที่ทำหาย
                    </label>

                    <input
                      id="lost-date"
                      type="date"
                      className="mt-2 h-11 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lost-time"
                      className="text-sm font-semibold text-foreground"
                    >
                      เวลาที่คาดว่าทำหาย
                    </label>

                    <input
                      id="lost-time"
                      type="time"
                      className="mt-2 h-11 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-brand-purple"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="lost-location"
                      className="text-sm font-semibold text-foreground"
                    >
                      สถานที่ที่ทำหาย
                    </label>

                    <div className="relative mt-2">
                      <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-purple" />

                      <select
                        id="lost-location"
                        disabled
                        className="h-11 w-full rounded-md border border-border bg-surface-muted pl-9 pr-3 text-sm text-text-secondary"
                      >
                        <option>
                          เลือกสถานที่
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-surface-muted p-4">
                  <p className="text-sm font-semibold text-foreground">
                    สถานะการค้นหา
                  </p>

                  <div className="mt-3 flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="lostStatus"
                        defaultChecked
                        className="accent-brand-purple"
                      />
                      กำลังตามหา
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="lostStatus"
                        className="accent-brand-purple"
                      />
                      ได้คืนแล้ว
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* FOUND */}
                <div>
                  <label
                    htmlFor="found-detail"
                    className="text-sm font-semibold text-foreground"
                  >
                    รายละเอียดของที่พบ
                  </label>

                  <textarea
                    id="found-detail"
                    rows={4}
                    placeholder="อธิบายลักษณะสิ่งของ, สี, ยี่ห้อ หรือจุดเด่นอื่นๆ"
                    className="mt-2 w-full resize-none rounded-md border border-border px-3 py-3 text-sm outline-none focus:border-brand-yellow"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="found-date"
                      className="text-sm font-semibold text-foreground"
                    >
                      วันที่พบ
                    </label>

                    <input
                      id="found-date"
                      type="date"
                      className="mt-2 h-11 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-brand-yellow"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="found-time"
                      className="text-sm font-semibold text-foreground"
                    >
                      เวลาที่พบ
                    </label>

                    <input
                      id="found-time"
                      type="time"
                      className="mt-2 h-11 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-brand-yellow"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="found-location"
                    className="text-sm font-semibold text-foreground"
                  >
                    สถานที่เก็บรักษาปัจจุบัน
                  </label>

                  <select
                    id="found-location"
                    disabled
                    className="mt-2 h-11 w-full rounded-md border border-border bg-surface-muted px-3 text-sm text-text-secondary"
                  >
                    <option>
                      เลือกสถานที่
                    </option>
                  </select>
                </div>

                <div className="rounded-lg bg-surface-muted p-4">
                  <p className="text-sm font-semibold text-foreground">
                    สถานะการส่งคืน
                  </p>

                  <div className="mt-3 flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="foundStatus"
                        defaultChecked
                        className="accent-yellow-400"
                      />
                      รอเจ้าของติดต่อ
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="foundStatus"
                        className="accent-yellow-400"
                      />
                      ส่งคืนเจ้าของแล้ว
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 border-t border-border bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text-secondary"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled
              title="รอเชื่อมข้อมูลหมวดหมู่และสถานที่จาก Backend"
              className={cn(
                "rounded-md px-6 py-2.5 text-sm font-semibold opacity-50",
                isLost
                  ? "bg-brand-purple text-white"
                  : "bg-brand-yellow text-foreground",
              )}
            >
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
