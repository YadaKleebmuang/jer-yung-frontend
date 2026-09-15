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
  type FormEvent,
} from "react";

import { cn } from "@/lib/utils";
import { ApiError } from "@/services/api-client";
import { getCategories } from "@/services/category.service";
import { createTransactionItem } from "@/services/transaction-item.service";
import { getLocations } from "@/services/location.service";
import { type Category } from "@/types/category";
import { type Location } from "@/types/location";
import { type TransactionItemStorageType } from "@/types/transaction-item";

export type ItemReportType =
  | "LOST"
  | "FOUND";

export interface ItemReportModalProps {
  open: boolean;
  type: ItemReportType;
  onClose: () => void;
  onSubmitted?: () => void;
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
  onSubmitted,
}: ItemReportModalProps) {
  const [activeType, setActiveType] =
    useState<ItemReportType>(type);

  const [images, setImages] = useState<
    SelectedImage[]
  >([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [lostCategoryId, setLostCategoryId] = useState("");
  const [lostLocationId, setLostLocationId] = useState("");
  const [foundCategoryId, setFoundCategoryId] = useState("");
  const [foundLocationId, setFoundLocationId] = useState("");

  const [lookupLoading, setLookupLoading] = useState(true);
  const [lookupError, setLookupError] = useState<string | null>(
    null,
  );

  const [lostName, setLostName] = useState("");
  const [lostDetails, setLostDetails] = useState("");

  const [foundName, setFoundName] = useState("");
  const [foundDetails, setFoundDetails] = useState("");
  const [foundStorageType, setFoundStorageType] =
    useState<TransactionItemStorageType | "">("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getCategories(),
      getLocations(),
    ])
      .then(([categoryData, locationData]) => {
        if (cancelled) return;

        setCategories(categoryData);
        setLocations(locationData);
        setLookupError(null);
      })
      .catch(() => {
        if (cancelled) return;

        setLookupError(
          "ไม่สามารถโหลดหมวดหมู่หรือสถานที่ได้",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLookupLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setSubmitError(null);

    const categoryId = isLost
      ? lostCategoryId
      : foundCategoryId;

    const locationId = isLost
      ? lostLocationId
      : foundLocationId;

    const itemName = isLost
      ? lostName.trim()
      : foundName.trim();

    const itemDetails = isLost
      ? lostDetails.trim()
      : foundDetails.trim();

    if (!itemName) {
      setSubmitError("กรุณากรอกชื่อสิ่งของ");
      return;
    }

    if (!categoryId) {
      setSubmitError("กรุณาเลือกหมวดหมู่");
      return;
    }

    if (!locationId) {
      setSubmitError("กรุณาเลือกสถานที่");
      return;
    }

    if (!isLost && !foundStorageType) {
      setSubmitError("กรุณาเลือกรูปแบบการเก็บรักษาสิ่งของ");
      return;
    }

    try {
      setSubmitting(true);

      await createTransactionItem({
        locationId: Number(locationId),
        categoryId: Number(categoryId),
        transactionItemsPostType: activeType,
        transactionItemsName: itemName,
        transactionItemsLocationDetails: itemDetails,
        transactionItemsStorageType:
          isLost
            ? undefined
            : foundStorageType || undefined,
        images: images.map((image) => image.file),
      });

      onSubmitted?.();
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : "ไม่สามารถบันทึกข้อมูลได้",
      );
    } finally {
      setSubmitting(false);
    }
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
          onSubmit={handleSubmit}
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
                      value={lostName}
                      onChange={(event) => {
                        setLostName(event.target.value);
                        setSubmitError(null);
                      }}
                      disabled={submitting}
                      placeholder="เช่น กระเป๋าสตางค์สีดำ"
                      className="mt-2 h-11 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-brand-purple disabled:opacity-60"
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
                      value={lostCategoryId}
                      onChange={(event) =>
                        setLostCategoryId(event.target.value)
                      }
                      disabled={lookupLoading}
                      className="mt-2 h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:border-brand-purple disabled:bg-surface-muted disabled:text-text-secondary"
                    >
                      <option value="">
                        {lookupLoading
                          ? "กำลังโหลดหมวดหมู่..."
                          : categories.length === 0
                            ? "ยังไม่มีหมวดหมู่ในระบบ"
                            : "เลือกหมวดหมู่"}
                      </option>

                      {categories.map((category) => (
                        <option
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="lost-details"
                      className="text-sm font-semibold text-foreground"
                    >
                      รายละเอียดเพิ่มเติม
                    </label>

                    <textarea
                      id="lost-details"
                      rows={3}
                      value={lostDetails}
                      onChange={(event) => {
                        setLostDetails(event.target.value);
                        setSubmitError(null);
                      }}
                      disabled={submitting}
                      placeholder="เช่น สี ยี่ห้อ ลักษณะเด่น หรือรายละเอียดบริเวณที่ทำหาย"
                      className="mt-2 w-full resize-none rounded-md border border-border px-3 py-3 text-sm outline-none focus:border-brand-purple disabled:opacity-60"
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
                        value={lostLocationId}
                        onChange={(event) =>
                          setLostLocationId(event.target.value)
                        }
                        disabled={lookupLoading}
                        className="h-11 w-full rounded-md border border-border bg-white pl-9 pr-3 text-sm outline-none focus:border-brand-purple disabled:bg-surface-muted disabled:text-text-secondary"
                      >
                        <option value="">
                          {lookupLoading
                            ? "กำลังโหลดสถานที่..."
                            : locations.length === 0
                              ? "ยังไม่มีสถานที่ในระบบ"
                              : "เลือกสถานที่"}
                        </option>

                        {locations.map((location) => (
                          <option
                            key={location.locationId}
                            value={location.locationId}
                          >
                            {location.locationName}
                            {location.locationZone
                              ? ` — ${location.locationZone}`
                              : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

              </>
            ) : (
              <>
                {/* FOUND */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="found-name"
                      className="text-sm font-semibold text-foreground"
                    >
                      ชื่อสิ่งของ
                    </label>

                    <input
                      id="found-name"
                      type="text"
                      value={foundName}
                      onChange={(event) => {
                        setFoundName(event.target.value);
                        setSubmitError(null);
                      }}
                      disabled={submitting}
                      placeholder="เช่น โทรศัพท์มือถือ"
                      className="mt-2 h-11 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-brand-yellow disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="found-detail"
                      className="text-sm font-semibold text-foreground"
                    >
                      รายละเอียดของที่พบ
                    </label>

                    <textarea
                      id="found-detail"
                      rows={3}
                      value={foundDetails}
                      onChange={(event) => {
                        setFoundDetails(event.target.value);
                        setSubmitError(null);
                      }}
                      disabled={submitting}
                      placeholder="สี ยี่ห้อ ลักษณะเด่น หรือรายละเอียดอื่นๆ"
                      className="mt-2 w-full resize-none rounded-md border border-border px-3 py-3 text-sm outline-none focus:border-brand-yellow disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="found-category"
                      className="text-sm font-semibold text-foreground"
                    >
                      หมวดหมู่
                    </label>

                    <select
                      id="found-category"
                      value={foundCategoryId}
                      onChange={(event) =>
                        setFoundCategoryId(event.target.value)
                      }
                      disabled={lookupLoading}
                      className="mt-2 h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:border-brand-yellow disabled:bg-surface-muted disabled:text-text-secondary"
                    >
                      <option value="">
                        {lookupLoading
                          ? "กำลังโหลดหมวดหมู่..."
                          : categories.length === 0
                            ? "ยังไม่มีหมวดหมู่ในระบบ"
                            : "เลือกหมวดหมู่"}
                      </option>

                      {categories.map((category) => (
                        <option
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="found-location"
                      className="text-sm font-semibold text-foreground"
                    >
                      สถานที่ที่พบ
                    </label>

                    <select
                      id="found-location"
                      value={foundLocationId}
                      onChange={(event) =>
                        setFoundLocationId(event.target.value)
                      }
                      disabled={lookupLoading}
                      className="mt-2 h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:border-brand-yellow disabled:bg-surface-muted disabled:text-text-secondary"
                    >
                      <option value="">
                        {lookupLoading
                          ? "กำลังโหลดสถานที่..."
                          : locations.length === 0
                            ? "ยังไม่มีสถานที่ในระบบ"
                            : "เลือกสถานที่"}
                      </option>

                      {locations.map((location) => (
                        <option
                          key={location.locationId}
                          value={location.locationId}
                        >
                          {location.locationName}
                          {location.locationZone
                            ? ` — ${location.locationZone}`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-lg bg-surface-muted p-4">
                  <p className="text-sm font-semibold text-foreground">
                    การเก็บรักษาสิ่งของ
                  </p>

                  <div className="mt-3 flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="foundStorageType"
                        value="SELF"
                        checked={foundStorageType === "SELF"}
                        onChange={() => {
                          setFoundStorageType("SELF");
                          setSubmitError(null);
                        }}
                        disabled={submitting}
                        className="accent-yellow-400"
                      />
                      เก็บไว้กับผู้พบ
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="foundStorageType"
                        value="CENTRAL"
                        checked={foundStorageType === "CENTRAL"}
                        onChange={() => {
                          setFoundStorageType("CENTRAL");
                          setSubmitError(null);
                        }}
                        disabled={submitting}
                        className="accent-yellow-400"
                      />
                      ฝากที่จุดรับฝากกลาง
                    </label>
                  </div>
                </div>
              </>
            )}
            {lookupError ? (
              <div
                role="alert"
                className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                {lookupError}
              </div>
            ) : null}

            {submitError ? (
              <div
                role="alert"
                className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                {submitError}
              </div>
            ) : null}
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
              disabled={
                submitting ||
                lookupLoading ||
                categories.length === 0 ||
                locations.length === 0
              }
              className={cn(
                "rounded-md px-6 py-2.5 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
                isLost
                  ? "bg-brand-purple text-white"
                  : "bg-brand-yellow text-foreground",
              )}
            >
              {submitting
                ? "กำลังบันทึก..."
                : "บันทึกข้อมูล"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
