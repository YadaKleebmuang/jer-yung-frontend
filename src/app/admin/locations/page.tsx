"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  Building2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { Modal } from "@/components/ui/Modal";
import { ApiError } from "@/services/api-client";
import {
  createLocation,
  deleteLocation,
  getLocations,
  updateLocation,
} from "@/services/location.service";
import { type Location } from "@/types/location";

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [locationZone, setLocationZone] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(
    null,
  );

  const [editingLocation, setEditingLocation] =
    useState<Location | null>(null);
  const [editName, setEditName] = useState("");
  const [editZone, setEditZone] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(
    null,
  );

  const [deletingLocation, setDeletingLocation] =
    useState<Location | null>(null);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    getLocations()
      .then((data) => {
        if (cancelled) return;

        setLocations(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;

        setError(
          err instanceof ApiError
            ? err.message
            : "ไม่สามารถโหลดรายการสถานที่ได้",
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

  async function refreshLocations() {
    const data = await getLocations();
    setLocations(data);
    setError(null);
  }

  const filteredLocations = useMemo(() => {
    const query = keyword.trim().toLowerCase();

    if (!query) {
      return locations;
    }

    return locations.filter((location) =>
      [
        location.locationName,
        location.locationZone ?? "",
        String(location.locationId),
      ].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [locations, keyword]);

  function openCreateModal() {
    setLocationName("");
    setLocationZone("");
    setFormError(null);
    setModalOpen(true);
  }

  function closeCreateModal() {
    if (saving) return;

    setModalOpen(false);
    setFormError(null);
  }

  async function handleCreateLocation(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const name = locationName.trim();
    const zone = locationZone.trim();

    if (!name) {
      setFormError("กรุณากรอกชื่อสถานที่");
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      await createLocation({
        locationName: name,
        locationZone: zone || undefined,
      });

      await refreshLocations();

      setModalOpen(false);
      setLocationName("");
      setLocationZone("");
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : "ไม่สามารถเพิ่มสถานที่ได้",
      );
    } finally {
      setSaving(false);
    }
  }

  function openEditModal(location: Location) {
    setEditingLocation(location);
    setEditName(location.locationName);
    setEditZone(location.locationZone ?? "");
    setEditError(null);
  }

  function closeEditModal() {
    if (editSaving) return;

    setEditingLocation(null);
    setEditError(null);
  }

  async function handleUpdateLocation(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!editingLocation) return;

    const name = editName.trim();
    const zone = editZone.trim();

    if (!name) {
      setEditError("กรุณากรอกชื่อสถานที่");
      return;
    }

    try {
      setEditSaving(true);
      setEditError(null);

      await updateLocation(
        editingLocation.locationId,
        {
          locationName: name,
          locationZone: zone || undefined,
        },
      );

      await refreshLocations();
      setEditingLocation(null);
    } catch (err) {
      setEditError(
        err instanceof ApiError
          ? err.message
          : "ไม่สามารถแก้ไขสถานที่ได้",
      );
    } finally {
      setEditSaving(false);
    }
  }

  function openDeleteModal(location: Location) {
    setDeletingLocation(location);
    setDeleteError(null);
  }

  function closeDeleteModal() {
    if (deleteSaving) return;

    setDeletingLocation(null);
    setDeleteError(null);
  }

  async function handleDeleteLocation() {
    if (!deletingLocation) return;

    try {
      setDeleteSaving(true);
      setDeleteError(null);

      await deleteLocation(
        deletingLocation.locationId,
      );

      await refreshLocations();
      setDeletingLocation(null);
    } catch (err) {
      setDeleteError(
        err instanceof ApiError
          ? err.message
          : "ไม่สามารถลบสถานที่ได้",
      );
    } finally {
      setDeleteSaving(false);
    }
  }

  return (
    <div className="py-8">
      <PageContainer>
        <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              จัดการสถานที่
            </h1>

            <p className="mt-2 text-text-secondary">
              จัดการสถานที่สำหรับการแจ้งของหายและสิ่งของที่พบ
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            เพิ่มสถานที่
          </button>
        </section>

        <section className="mt-8 rounded-2xl bg-surface p-5">
          <div className="flex h-11 items-center gap-3 rounded-lg bg-surface-muted px-4">
            <Search
              className="size-5 text-text-secondary"
              aria-hidden="true"
            />

            <input
              type="search"
              value={keyword}
              onChange={(event) =>
                setKeyword(event.target.value)
              }
              placeholder="ค้นหาสถานที่..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl bg-surface">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-xl font-bold text-foreground">
              รายการสถานที่
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              สถานที่ทั้งหมดที่ใช้ในระบบ Jer-Yung
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center px-6 text-sm text-text-secondary">
              กำลังโหลดรายการสถานที่...
            </div>
          ) : error ? (
            <div className="flex min-h-72 items-center justify-center px-6 text-center">
              <p className="text-sm text-danger">
                {error}
              </p>
            </div>
          ) : locations.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
              <div className="relative flex size-16 items-center justify-center rounded-full bg-green-50">
                <MapPin
                  className="size-8 text-green-600"
                  aria-hidden="true"
                />

                <Building2
                  className="absolute -bottom-1 -right-1 size-5 rounded bg-white p-0.5 text-brand-purple"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-4 font-semibold text-foreground">
                ยังไม่มีสถานที่ในระบบ
              </h3>

              <p className="mt-2 max-w-md text-sm text-text-secondary">
                API เชื่อมต่อสำเร็จแล้ว แต่ฐานข้อมูลยังไม่มีรายการสถานที่
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="bg-surface-muted text-sm text-text-secondary">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      ชื่อสถานที่
                    </th>
                    <th className="px-6 py-4 font-medium">
                      โซน / ห้อง
                    </th>
                    <th className="px-6 py-4 font-medium">
                      รหัส
                    </th>
                    <th className="px-6 py-4 text-right font-medium">
                      จัดการ
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {filteredLocations.map((location) => (
                    <tr key={location.locationId}>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {location.locationName}
                      </td>

                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {location.locationZone || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {location.locationId}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(location)
                            }
                            className="inline-flex size-9 items-center justify-center rounded-lg text-brand-purple transition-colors hover:bg-brand-purple/10"
                            aria-label={`แก้ไข ${location.locationName}`}
                          >
                            <Pencil
                              className="size-4"
                              aria-hidden="true"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal(location)
                            }
                            className="inline-flex size-9 items-center justify-center rounded-lg text-danger transition-colors hover:bg-danger/10"
                            aria-label={`ลบ ${location.locationName}`}
                          >
                            <Trash2
                              className="size-4"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredLocations.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-text-secondary">
                  ไม่พบสถานที่ที่ตรงกับคำค้นหา
                </div>
              ) : null}
            </div>
          )}
        </section>
      </PageContainer>

      <Modal
        open={modalOpen}
        onClose={closeCreateModal}
        title="เพิ่มสถานที่"
        description="เพิ่มสถานที่สำหรับใช้ในการแจ้งของหายและสิ่งของที่พบ"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={closeCreateModal}
              disabled={saving}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground disabled:opacity-50"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              form="create-location-form"
              disabled={saving || !locationName.trim()}
              className="rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "กำลังบันทึก..."
                : "บันทึกสถานที่"}
            </button>
          </>
        }
      >
        <form
          id="create-location-form"
          onSubmit={handleCreateLocation}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="location-name"
              className="text-sm font-medium text-foreground"
            >
              ชื่อสถานที่
              <span className="ml-1 text-danger">*</span>
            </label>

            <input
              id="location-name"
              type="text"
              value={locationName}
              onChange={(event) => {
                setLocationName(event.target.value);
                setFormError(null);
              }}
              disabled={saving}
              placeholder="เช่น อาคาร 15"
              autoFocus
              className="mt-2 h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none transition-colors focus:border-brand-purple disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="location-zone"
              className="text-sm font-medium text-foreground"
            >
              โซน / ห้อง
            </label>

            <input
              id="location-zone"
              type="text"
              value={locationZone}
              onChange={(event) => {
                setLocationZone(event.target.value);
                setFormError(null);
              }}
              disabled={saving}
              placeholder="เช่น ชั้น 1 โถงทางเข้า"
              className="mt-2 h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none transition-colors focus:border-brand-purple disabled:opacity-60"
            />
          </div>

          {formError ? (
            <div
              role="alert"
              className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              {formError}
            </div>
          ) : null}
        </form>
      </Modal>

      <Modal
        open={editingLocation !== null}
        onClose={closeEditModal}
        title="แก้ไขสถานที่"
        description="แก้ไขชื่อสถานที่และโซนหรือห้อง"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={closeEditModal}
              disabled={editSaving}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground disabled:opacity-50"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              form="edit-location-form"
              disabled={
                editSaving || !editName.trim()
              }
              className="rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editSaving
                ? "กำลังบันทึก..."
                : "บันทึกการแก้ไข"}
            </button>
          </>
        }
      >
        <form
          id="edit-location-form"
          onSubmit={handleUpdateLocation}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="edit-location-name"
              className="text-sm font-medium text-foreground"
            >
              ชื่อสถานที่
              <span className="ml-1 text-danger">*</span>
            </label>

            <input
              id="edit-location-name"
              type="text"
              value={editName}
              onChange={(event) => {
                setEditName(event.target.value);
                setEditError(null);
              }}
              disabled={editSaving}
              className="mt-2 h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none transition-colors focus:border-brand-purple disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="edit-location-zone"
              className="text-sm font-medium text-foreground"
            >
              โซน / ห้อง
            </label>

            <input
              id="edit-location-zone"
              type="text"
              value={editZone}
              onChange={(event) => {
                setEditZone(event.target.value);
                setEditError(null);
              }}
              disabled={editSaving}
              className="mt-2 h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none transition-colors focus:border-brand-purple disabled:opacity-60"
            />
          </div>

          {editError ? (
            <div
              role="alert"
              className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              {editError}
            </div>
          ) : null}
        </form>
      </Modal>

      <Modal
        open={deletingLocation !== null}
        onClose={closeDeleteModal}
        title="ยืนยันการลบสถานที่"
        description="การลบสถานที่อาจส่งผลต่อข้อมูลสิ่งของที่อ้างอิงสถานที่นี้"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={deleteSaving}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground disabled:opacity-50"
            >
              ยกเลิก
            </button>

            <button
              type="button"
              onClick={() => void handleDeleteLocation()}
              disabled={deleteSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="size-4" />
              {deleteSaving
                ? "กำลังลบ..."
                : "ลบสถานที่"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-danger/10 p-4">
            <p className="text-sm text-foreground">
              ต้องการลบสถานที่
              <span className="font-semibold">
                {" "}
                {deletingLocation?.locationName}
              </span>
              {" "}ใช่หรือไม่?
            </p>
          </div>

          {deleteError ? (
            <div
              role="alert"
              className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              {deleteError}
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
