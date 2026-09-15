"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  ImagePlus,
  PackageCheck,
  QrCode,
  Search,
  Send,
  Warehouse,
} from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { ApiError } from "@/services/api-client";
import { getCategories } from "@/services/category.service";
import { getLocations } from "@/services/location.service";
import {
  checkoutCentralItem,
  getCentralItemByReference,
  getCentralStorageItems,
  getCentralStorageStats,
  warehouseReceiveCentralItem,
  type CentralStatus,
  type CentralStorageStats,
} from "@/services/central-storage.service";
import {
  StorageDetailModal,
  StorageEditModal,
  StorageInventoryModal,
} from "@/features/items/StorageFlowModals";
import { type TransactionItemListItem } from "@/types/transaction-item";
import { type TransactionItemDetail } from "@/types/transaction-item-detail";
import { type Category } from "@/types/category";
import { type Location } from "@/types/location";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "";

function mapDetailToListItem(
  detail: TransactionItemDetail,
): TransactionItemListItem {
  return {
    transactionItemId:
      detail.Transaction_item_id,
    imageUrl: detail.ImageUrl,
    transactionItemsPostType:
      detail.Transaction_items_post_type,
    transactionItemsName:
      detail.Transaction_items_name,
    transactionItemReferenceTag:
      detail.Transaction_item_reference_tag,
    transactionItemsLocationDetails:
      detail.Transaction_items_location_details,
    transactionItemsDate:
      detail.Transaction_items_date,
    transactionItemsStorageType:
      detail.Transaction_items_storage_type,
    location: detail.Location
      ? {
          locationId:
            detail.Location.Location_id,
          locationName:
            detail.Location.Location_name,
          isCentralStation:
            detail.Location.is_central_station,
          centralStationName:
            detail.Location.central_station_name,
        }
      : null,
    categories: detail.Categories
      ? {
          categoryId:
            detail.Categories.category_id,
          categoryName:
            detail.Categories.category_name,
        }
      : null,
    users: detail.Users
      ? {
          userId:
            detail.Users.user_id,
          userName:
            detail.Users.user_name,
          userPhoneNumber:
            detail.Users.user_phone_number,
          userLineId:
            detail.Users.user_line_id,
        }
      : null,
  };
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "th-TH",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function getImageUrl(path: string) {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${API_URL}/api/images/${path}`;
}

export default function StoragePage() {
  const checkoutSectionRef =
    useRef<HTMLElement | null>(null);

  const [items, setItems] =
    useState<TransactionItemListItem[]>([]);

  const [storageLoadError, setStorageLoadError] =
    useState<string | null>(null);

  const [checkinFinderName, setCheckinFinderName] =
    useState("");

  const [checkinDetails, setCheckinDetails] =
    useState("");

  const [checkinImages, setCheckinImages] =
    useState<File[]>([]);

  const [
    checkinCategoryId,
    setCheckinCategoryId,
  ] = useState("");

  const [
    checkinLocationId,
    setCheckinLocationId,
  ] = useState("");

  const [
    checkinCategories,
    setCheckinCategories,
  ] = useState<Category[]>([]);

  const [
    checkinLocations,
    setCheckinLocations,
  ] = useState<Location[]>([]);

  const [
    checkinLookupLoading,
    setCheckinLookupLoading,
  ] = useState(true);

  const [
    checkinSubmitting,
    setCheckinSubmitting,
  ] = useState(false);

  const [
    checkinError,
    setCheckinError,
  ] = useState<string | null>(null);

  const [
    checkinSuccess,
    setCheckinSuccess,
  ] = useState<string | null>(null);

  const [
    inventoryOpen,
    setInventoryOpen,
  ] = useState(false);

  const [
    centralStats,
    setCentralStats,
  ] = useState<CentralStorageStats | null>(
    null,
  );

  const [
    centralStatsLoading,
    setCentralStatsLoading,
  ] = useState(false);

  const [
    centralStatsError,
    setCentralStatsError,
  ] = useState<string | null>(null);

  const [
    inventoryItems,
    setInventoryItems,
  ] = useState<TransactionItemListItem[]>([]);

  const [
    inventoryPage,
    setInventoryPage,
  ] = useState(0);

  const [
    inventoryTotalPages,
    setInventoryTotalPages,
  ] = useState(0);

  const [
    inventoryTotalElements,
    setInventoryTotalElements,
  ] = useState(0);

  const [
    inventoryLoading,
    setInventoryLoading,
  ] = useState(false);

  const [
    inventoryError,
    setInventoryError,
  ] = useState<string | null>(null);

  const [
    inventoryKeyword,
    setInventoryKeyword,
  ] = useState("");

  const [
    inventoryCategoryId,
    setInventoryCategoryId,
  ] = useState("");

  const [
    inventoryStatus,
    setInventoryStatus,
  ] = useState<CentralStatus | "">("");

  const [
    detailItem,
    setDetailItem,
  ] =
    useState<TransactionItemListItem | null>(
      null,
    );

  const [
    editItem,
    setEditItem,
  ] =
    useState<TransactionItemListItem | null>(
      null,
    );

  const [
    checkoutItem,
    setCheckoutItem,
  ] =
    useState<TransactionItemListItem | null>(
      null,
    );

  const [
    referenceCode,
    setReferenceCode,
  ] = useState("");

  const [
    receiverName,
    setReceiverName,
  ] = useState("");

  const [
    proofImage,
    setProofImage,
  ] = useState<File | null>(null);

  const [
    checkoutError,
    setCheckoutError,
  ] = useState<string | null>(null);

  const [
    referenceSearching,
    setReferenceSearching,
  ] = useState(false);

  const [
    checkoutSubmitting,
    setCheckoutSubmitting,
  ] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getCentralStorageItems({
      page: 0,
      limit: 10,
    })
      .then((response) => {
        if (cancelled) return;

        setItems(response.content.content);
        setStorageLoadError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;

        const message =
          err instanceof ApiError
            ? err.message
            : "ไม่สามารถโหลดข้อมูลคลังกลางได้";

        setStorageLoadError(message);

        setItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getCategories(),
      getLocations(),
    ])
      .then(([categoryData, locationData]) => {
        if (cancelled) return;

        setCheckinCategories(categoryData);
        setCheckinLocations(locationData);
        setCheckinError(null);
      })
      .catch(() => {
        if (cancelled) return;

        setCheckinError(
          "ไม่สามารถโหลดหมวดหมู่หรือสถานที่ได้",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setCheckinLookupLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const latestItems = items.slice(0, 3);

  async function loadInventoryPage(
    page: number,
    keyword = inventoryKeyword,
    categoryId = inventoryCategoryId,
    status = inventoryStatus,
  ) {
    try {
      setInventoryLoading(true);
      setInventoryError(null);
      setInventoryPage(page);

      const response =
        await getCentralStorageItems({
          keyword:
            keyword.trim() || undefined,
          categoryId:
            categoryId
              ? Number(categoryId)
              : undefined,
          status:
            status || undefined,
          page,
          limit: 10,
        });

      const data = response.content;

      setInventoryItems(data.content);
      setInventoryPage(data.number);
      setInventoryTotalPages(
        data.totalPages,
      );
      setInventoryTotalElements(
        data.totalElements,
      );
    } catch (err) {
      setInventoryItems([]);
      setInventoryTotalPages(0);
      setInventoryTotalElements(0);

      setInventoryError(
        err instanceof ApiError
          ? err.message
          : "ไม่สามารถโหลดรายการคลังกลางได้",
      );
    } finally {
      setInventoryLoading(false);
    }
  }

  function searchInventory(
    keyword: string,
  ) {
    const normalized = keyword.trim();

    setInventoryKeyword(normalized);
    void loadInventoryPage(
      0,
      normalized,
      inventoryCategoryId,
      inventoryStatus,
    );
  }

  function filterInventoryByCategory(
    categoryId: string,
  ) {
    setInventoryCategoryId(categoryId);

    void loadInventoryPage(
      0,
      inventoryKeyword,
      categoryId,
      inventoryStatus,
    );
  }

  function filterInventoryByStatus(
    status: CentralStatus | "",
  ) {
    setInventoryStatus(status);

    void loadInventoryPage(
      0,
      inventoryKeyword,
      inventoryCategoryId,
      status,
    );
  }

  async function openInventory() {
    setInventoryOpen(true);
    setInventoryKeyword("");
    setInventoryCategoryId("");
    setInventoryStatus("");

    void loadInventoryPage(
      0,
      "",
      "",
      "",
    );

    setCentralStatsLoading(true);
    setCentralStatsError(null);

    try {
      const response =
        await getCentralStorageStats();

      setCentralStats(response.content);
    } catch (err) {
      setCentralStats(null);
      setCentralStatsError(
        err instanceof ApiError
          ? err.message
          : "ไม่สามารถโหลดสถิติคลังกลางได้",
      );
    } finally {
      setCentralStatsLoading(false);
    }
  }

  function selectForCheckout(
    item: TransactionItemListItem,
  ) {
    setInventoryOpen(false);
    setDetailItem(null);
    setEditItem(null);
    setCheckoutItem(item);
    setReferenceCode(
      item.transactionItemReferenceTag ??
        "",
    );
    setCheckoutError(null);

    window.requestAnimationFrame(() => {
      checkoutSectionRef.current?.scrollIntoView(
        {
          behavior: "smooth",
          block: "start",
        },
      );
    });
  }

  async function handleReferenceSearch() {
    const code = referenceCode.trim();

    if (!code) {
      setCheckoutError(
        "กรุณากรอกรหัสอ้างอิง",
      );
      return;
    }

    try {
      setReferenceSearching(true);
      setCheckoutError(null);
      setCheckoutItem(null);

      const response =
        await getCentralItemByReference(code);

      const item = mapDetailToListItem(
        response.content,
      );

      setCheckoutItem(item);
      setReferenceCode(
        item.transactionItemReferenceTag ??
          code,
      );
      setReceiverName("");
      setProofImage(null);
    } catch (err) {
      setCheckoutItem(null);

      setCheckoutError(
        err instanceof ApiError
          ? err.message
          : "ไม่สามารถค้นหารหัสอ้างอิงได้",
      );
    } finally {
      setReferenceSearching(false);
    }
  }

  async function handleCheckinSubmit() {
    const details = checkinDetails.trim();

    setCheckinError(null);
    setCheckinSuccess(null);

    if (!details) {
      setCheckinError(
        "กรุณากรอกรายละเอียดสิ่งของ",
      );
      return;
    }

    if (!checkinCategoryId) {
      setCheckinError(
        "กรุณาเลือกหมวดหมู่",
      );
      return;
    }

    if (!checkinLocationId) {
      setCheckinError(
        "กรุณาเลือกสถานที่พบ",
      );
      return;
    }

    try {
      setCheckinSubmitting(true);

      await warehouseReceiveCentralItem({
        finderName:
          checkinFinderName.trim() ||
          undefined,
        itemDetails: details,
        categoryId:
          Number(checkinCategoryId),
        locationId:
          Number(checkinLocationId),
        itemImages: checkinImages,
      });

      setCheckinFinderName("");
      setCheckinDetails("");
      setCheckinImages([]);
      setCheckinCategoryId("");
      setCheckinLocationId("");
      setCheckinSuccess(
        "รับสิ่งของเข้าคลังเรียบร้อยแล้ว",
      );

      try {
        const response =
          await getCentralStorageItems({
            page: 0,
            limit: 10,
          });

        setItems(response.content.content);
        setStorageLoadError(null);
      } catch (refreshError) {
        setStorageLoadError(
          refreshError instanceof ApiError
            ? refreshError.message
            : "ไม่สามารถโหลดรายการคลังล่าสุดได้",
        );
      }
    } catch (err) {
      setCheckinError(
        err instanceof ApiError
          ? err.message
          : "ไม่สามารถรับสิ่งของเข้าคลังได้",
      );
    } finally {
      setCheckinSubmitting(false);
    }
  }

  async function handleCheckoutSubmit() {
    if (!checkoutItem) {
      setCheckoutError(
        "กรุณาค้นหาและเลือกรายการสิ่งของก่อน",
      );
      return;
    }

    const normalizedReceiverName =
      receiverName.trim();

    if (!normalizedReceiverName) {
      setCheckoutError(
        "กรุณากรอกชื่อผู้รับคืน",
      );
      return;
    }

    try {
      setCheckoutSubmitting(true);
      setCheckoutError(null);

      await checkoutCentralItem({
        itemId:
          checkoutItem.transactionItemId,
        receiverName:
          normalizedReceiverName,
        proofImage:
          proofImage ?? undefined,
      });

      setCheckoutItem(null);
      setReferenceCode("");
      setReceiverName("");
      setProofImage(null);

      const response =
        await getCentralStorageItems({
          page: 0,
          limit: 10,
        });

      setItems(response.content.content);
      setStorageLoadError(null);
    } catch (err) {
      setCheckoutError(
        err instanceof ApiError
          ? err.message
          : "ไม่สามารถบันทึกการส่งคืนได้",
      );
    } finally {
      setCheckoutSubmitting(false);
    }
  }

  return (
    <div className="py-8">
      <PageContainer>
        <section>
          <h1 className="text-3xl font-bold text-brand-purple">
            จัดการจุดรับฝากกลาง
          </h1>

          <p className="mt-2 text-text-secondary">
            บันทึกรับ-จ่ายสิ่งของและจัดการคลัง
          </p>

          {storageLoadError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              <p className="font-semibold">
                ไม่สามารถโหลดข้อมูลคลังกลางได้
              </p>
              <p className="mt-1 text-xs">
                {storageLoadError}
              </p>
            </div>
          ) : null}
        </section>

        <section className="mt-7 grid gap-6 xl:grid-cols-2">
          {/* Check-in */}
          <article className="rounded-2xl bg-surface p-6">
            <div className="flex items-center gap-2">
              <Warehouse className="size-5 text-brand-purple" />
              <h2 className="text-xl font-bold">
                รับของเข้าคลัง (Check-in)
              </h2>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  ชื่อผู้พบ/ผู้นำมาส่ง
                </label>
                <input
                  type="text"
                  value={checkinFinderName}
                  onChange={(event) => {
                    setCheckinFinderName(
                      event.target.value,
                    );
                    setCheckinError(null);
                    setCheckinSuccess(null);
                  }}
                  disabled={checkinSubmitting}
                  placeholder="กรอกชื่อ-นามสกุล"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-purple disabled:opacity-60"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  รายละเอียดสิ่งของ
                </label>
                <textarea
                  rows={4}
                  value={checkinDetails}
                  onChange={(event) => {
                    setCheckinDetails(
                      event.target.value,
                    );
                    setCheckinError(null);
                    setCheckinSuccess(null);
                  }}
                  disabled={checkinSubmitting}
                  placeholder="ลักษณะ, สี, ยี่ห้อ..."
                  className="w-full resize-none rounded-lg border border-border bg-surface-muted p-3 text-sm outline-none focus:border-brand-purple disabled:opacity-60"
                />
              </div>

              <div>
                <div className="mb-2 flex justify-between gap-4">
                  <span className="text-sm font-semibold">
                    รูปภาพสิ่งของที่รับเข้าคลัง
                  </span>
                  <span className="text-xs text-text-secondary">
                    เลือกแล้ว {checkinImages.length}/5 รูป
                  </span>
                </div>

                <label
                  htmlFor="checkin-images"
                  className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface-muted"
                >
                  <ImagePlus className="size-6 text-brand-purple" />
                  <span className="mt-2 text-sm font-semibold">
                    เพิ่มรูปภาพ
                  </span>
                  <span className="mt-1 text-xs text-text-secondary">
                    สูงสุด 5MB ต่อรูป
                  </span>
                </label>

                <input
                  id="checkin-images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={checkinSubmitting}
                  className="sr-only"
                  onChange={(event) => {
                    const files = Array.from(
                      event.target.files ?? [],
                    );

                    const validFiles =
                      files.filter(
                        (file) =>
                          file.size <=
                          5 * 1024 * 1024,
                      );

                    if (
                      validFiles.length !==
                      files.length
                    ) {
                      setCheckinError(
                        "รูปภาพแต่ละไฟล์ต้องมีขนาดไม่เกิน 5MB",
                      );
                    } else {
                      setCheckinError(null);
                    }

                    setCheckinImages(
                      validFiles.slice(0, 5),
                    );
                    setCheckinSuccess(null);

                    event.target.value = "";
                  }}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    หมวดหมู่
                  </label>
                  <select
                    value={checkinCategoryId}
                    onChange={(event) => {
                      setCheckinCategoryId(
                        event.target.value,
                      );
                      setCheckinError(null);
                      setCheckinSuccess(null);
                    }}
                    disabled={
                      checkinLookupLoading ||
                      checkinSubmitting
                    }
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-purple disabled:bg-surface-muted disabled:text-text-secondary"
                  >
                    <option value="">
                      {checkinLookupLoading
                        ? "กำลังโหลดหมวดหมู่..."
                        : checkinCategories.length === 0
                          ? "ยังไม่มีหมวดหมู่ในระบบ"
                          : "เลือกหมวดหมู่"}
                    </option>

                    {checkinCategories.map(
                      (category) => (
                        <option
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.categoryName}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    สถานที่พบ
                  </label>
                  <select
                    value={checkinLocationId}
                    onChange={(event) => {
                      setCheckinLocationId(
                        event.target.value,
                      );
                      setCheckinError(null);
                      setCheckinSuccess(null);
                    }}
                    disabled={
                      checkinLookupLoading ||
                      checkinSubmitting
                    }
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-purple disabled:bg-surface-muted disabled:text-text-secondary"
                  >
                    <option value="">
                      {checkinLookupLoading
                        ? "กำลังโหลดสถานที่..."
                        : checkinLocations.length === 0
                          ? "ยังไม่มีสถานที่ในระบบ"
                          : "เลือกสถานที่พบ"}
                    </option>

                    {checkinLocations.map(
                      (location) => (
                        <option
                          key={location.locationId}
                          value={location.locationId}
                        >
                          {location.locationName}
                          {location.locationZone
                            ? ` — ${location.locationZone}`
                            : ""}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              {checkinError ? (
                <p
                  role="alert"
                  className="text-sm text-danger"
                >
                  {checkinError}
                </p>
              ) : null}

              {checkinSuccess ? (
                <p className="text-sm font-medium text-green-700">
                  {checkinSuccess}
                </p>
              ) : null}

              <button
                type="button"
                onClick={() =>
                  void handleCheckinSubmit()
                }
                disabled={
                  checkinSubmitting ||
                  checkinLookupLoading ||
                  !checkinDetails.trim() ||
                  !checkinCategoryId ||
                  !checkinLocationId ||
                  checkinCategories.length === 0 ||
                  checkinLocations.length === 0
                }
                className="h-11 w-full rounded-lg bg-brand-purple text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkinSubmitting
                  ? "กำลังบันทึก..."
                  : "บันทึกรับของ"}
              </button>
            </div>
          </article>

          {/* Check-out */}
          <article
            ref={checkoutSectionRef}
            className="scroll-mt-24 rounded-2xl bg-surface p-6"
          >
            <div className="flex items-center gap-2">
              <PackageCheck className="size-5 text-brand-purple" />
              <h2 className="text-xl font-bold">
                ส่งคืนสิ่งของ (Check-out)
              </h2>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  รหัสอ้างอิงสิ่งของ
                </label>

                <div className="flex gap-3">
                  <input
                    value={referenceCode}
                    onChange={(event) => {
                      setReferenceCode(
                        event.target.value,
                      );
                      setCheckoutError(null);
                    }}
                    type="text"
                    disabled={referenceSearching}
                    placeholder="เช่น BRU-26-XXXX"
                    className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-purple disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      void handleReferenceSearch()
                    }
                    disabled={referenceSearching}
                    className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-yellow px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Search className="size-4" />
                    {referenceSearching
                      ? "กำลังค้นหา..."
                      : "ค้นหา"}
                  </button>
                </div>

                {checkoutError ? (
                  <p className="mt-2 text-sm text-danger">
                    {checkoutError}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  ชื่อผู้รับคืน
                </label>
                <input
                  value={receiverName}
                  onChange={(event) => {
                    setReceiverName(
                      event.target.value,
                    );
                    setCheckoutError(null);
                  }}
                  type="text"
                  disabled={
                    !checkoutItem ||
                    checkoutSubmitting
                  }
                  placeholder="กรอกชื่อ-นามสกุลผู้รับ"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand-purple disabled:opacity-60"
                />
              </div>

              <div>
                <div className="mb-2 flex justify-between gap-4">
                  <span className="text-sm font-semibold">
                    รูปภาพสิ่งของที่รับเข้าคลัง
                  </span>
                  <span className="text-xs text-text-secondary">
                    {checkoutItem
                      ? checkoutItem.transactionItemReferenceTag
                      : "ค้นหารหัสอ้างอิงเพื่อแสดงข้อมูล"}
                  </span>
                </div>

                {checkoutItem ? (
                  <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <p className="font-semibold">
                      {
                        checkoutItem.transactionItemsName
                      }
                    </p>

                    <p className="mt-1 text-sm text-text-secondary">
                      {
                        checkoutItem.transactionItemsLocationDetails
                      }
                    </p>

                    {checkoutItem.imageUrl
                      .length > 0 ? (
                      <div className="mt-4 flex gap-3 overflow-x-auto">
                        {checkoutItem.imageUrl
                          .slice(0, 5)
                          .map((image) => (
                            <Image
                              key={image}
                              src={getImageUrl(
                                image,
                              )}
                              alt=""
                              width={110}
                              height={90}
                              className="h-20 w-24 shrink-0 rounded-lg object-cover"
                            />
                          ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-text-secondary">
                        ไม่มีรูปภาพในข้อมูลทดสอบ
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted">
                    <p className="text-sm text-text-secondary">
                      ยังไม่ได้เลือกสิ่งของ
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="proof-image"
                  className="mb-2 block text-sm font-semibold"
                >
                  หลักฐานการรับคืน
                </label>

                <label
                  htmlFor="proof-image"
                  className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface-muted p-4 text-center"
                >
                  <ImagePlus className="size-6 text-text-secondary" />
                  <span className="mt-2 text-sm font-medium">
                    {proofImage
                      ? proofImage.name
                      : "แนบรูปถ่ายบัตรหรือเอกสาร"}
                  </span>
                </label>

                <input
                  id="proof-image"
                  type="file"
                  accept="image/*"
                  disabled={
                    !checkoutItem ||
                    checkoutSubmitting
                  }
                  className="sr-only"
                  onChange={(event) => {
                    setProofImage(
                      event.target
                        .files?.[0] ??
                        null,
                    );
                    setCheckoutError(null);
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  void handleCheckoutSubmit()
                }
                disabled={
                  !checkoutItem ||
                  !receiverName.trim() ||
                  checkoutSubmitting
                }
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-purple text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="size-4" />
                {checkoutSubmitting
                  ? "กำลังบันทึก..."
                  : "บันทึกการส่งคืน"}
              </button>
            </div>
          </article>
        </section>

        {/* Bottom */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[280px_1fr]">
          <article className="flex flex-col items-center justify-center rounded-2xl bg-surface p-6 text-center">
            <QrCode className="size-12 text-brand-purple" />
            <h2 className="mt-4 text-xl font-bold">
              สร้างรหัสอ้างอิง
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              สร้าง QR Code หรือรหัสติดตาม
              สำหรับติดที่สิ่งของที่รับเข้ามาใหม่
            </p>
            <button
              type="button"
              disabled
              className="mt-5 h-10 w-full rounded-lg bg-brand-yellow text-sm font-semibold opacity-60"
            >
              สร้างรหัสใหม่
            </button>
          </article>

          <article className="overflow-hidden rounded-2xl bg-surface">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="flex items-center gap-2">
                <Warehouse className="size-5 text-brand-purple" />
                <h2 className="text-xl font-bold">
                  รายการในคลังกลาง (ล่าสุด)
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  void openInventory()
                }
                className="text-sm font-semibold text-brand-purple hover:underline"
              >
                ดูทั้งหมด
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead className="text-sm text-text-secondary">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      รหัสอ้างอิง
                    </th>
                    <th className="px-6 py-4 font-medium">
                      รายการ
                    </th>
                    <th className="px-6 py-4 font-medium">
                      วันที่รับเข้า
                    </th>
                    <th className="px-6 py-4 text-center font-medium">
                      สถานะ
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {latestItems.map((item) => (
                    <tr
                      key={
                        item.transactionItemId
                      }
                      className="text-sm"
                    >
                      <td className="px-6 py-4 font-medium">
                        {
                          item.transactionItemReferenceTag
                        }
                      </td>
                      <td className="px-6 py-4">
                        {
                          item.transactionItemsName
                        }
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {formatDate(
                          item.transactionItemsDate,
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="rounded-full bg-brand-purple/10 px-2.5 py-1 text-xs font-semibold text-brand-purple">
                          รอส่งคืน
                        </span>
                      </td>
                    </tr>
                  ))}

                  {latestItems.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-16 text-center text-sm text-text-secondary"
                      >
                        ยังไม่มีข้อมูลที่แสดง
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </PageContainer>

      <StorageInventoryModal
        open={inventoryOpen}
        items={inventoryItems}
        stats={centralStats}
        statsLoading={centralStatsLoading}
        statsError={centralStatsError}
        listLoading={inventoryLoading}
        listError={inventoryError}
        page={inventoryPage}
        totalPages={inventoryTotalPages}
        totalElements={inventoryTotalElements}
        appliedKeyword={inventoryKeyword}
        categories={checkinCategories}
        categoryId={inventoryCategoryId}
        status={inventoryStatus}
        onPageChange={(page) =>
          void loadInventoryPage(page)
        }
        onSearch={searchInventory}
        onCategoryChange={
          filterInventoryByCategory
        }
        onStatusChange={
          filterInventoryByStatus
        }
        onClose={() =>
          setInventoryOpen(false)
        }
        onView={(item) =>
          setDetailItem(item)
        }
        onEdit={(item) =>
          setEditItem(item)
        }
        onReturn={selectForCheckout}
      />

      {detailItem ? (
        <StorageDetailModal
          item={detailItem}
          onClose={() =>
            setDetailItem(null)
          }
        />
      ) : null}

      {editItem ? (
        <StorageEditModal
          item={editItem}
          onClose={() =>
            setEditItem(null)
          }
          onSaved={(updatedItem) => {
            setItems((current) =>
              current.map((item) =>
                item.transactionItemId ===
                updatedItem.transactionItemId
                  ? updatedItem
                  : item,
              ),
            );
            setEditItem(null);
          }}
        />
      ) : null}
    </div>
  );
}
