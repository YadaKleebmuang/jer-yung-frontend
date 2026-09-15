"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  FolderCog,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { Modal } from "@/components/ui/Modal";
import { ApiError } from "@/services/api-client";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/category.service";
import { type Category } from "@/types/category";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] =
    useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(
    null,
  );

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] =
    useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(
    null,
  );

  const [deletingCategory, setDeletingCategory] =
    useState<Category | null>(null);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((data) => {
        if (cancelled) return;

        setCategories(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;

        setError(
          err instanceof ApiError
            ? err.message
            : "ไม่สามารถโหลดรายการหมวดหมู่ได้",
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

  async function refreshCategories() {
    const data = await getCategories();
    setCategories(data);
    setError(null);
  }

  const filteredCategories = useMemo(() => {
    const query = keyword.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) =>
      [
        category.categoryName,
        category.categoryDescription ?? "",
        String(category.categoryId),
      ].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [categories, keyword]);

  function openCreateModal() {
    setCategoryName("");
    setCategoryDescription("");
    setFormError(null);
    setModalOpen(true);
  }

  function closeCreateModal() {
    if (saving) return;

    setModalOpen(false);
    setFormError(null);
  }

  async function handleCreateCategory(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const name = categoryName.trim();
    const description = categoryDescription.trim();

    if (!name) {
      setFormError("กรุณากรอกชื่อหมวดหมู่");
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      await createCategory({
        categoryName: name,
        categoryDescription: description || undefined,
      });

      await refreshCategories();

      setModalOpen(false);
      setCategoryName("");
      setCategoryDescription("");
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : "ไม่สามารถเพิ่มหมวดหมู่ได้",
      );
    } finally {
      setSaving(false);
    }
  }

  function openEditModal(category: Category) {
    setEditingCategory(category);
    setEditName(category.categoryName);
    setEditDescription(
      category.categoryDescription ?? "",
    );
    setEditError(null);
  }

  function closeEditModal() {
    if (editSaving) return;

    setEditingCategory(null);
    setEditError(null);
  }

  async function handleUpdateCategory(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!editingCategory) return;

    const name = editName.trim();
    const description = editDescription.trim();

    if (!name) {
      setEditError("กรุณากรอกชื่อหมวดหมู่");
      return;
    }

    try {
      setEditSaving(true);
      setEditError(null);

      await updateCategory(
        editingCategory.categoryId,
        {
          categoryName: name,
          categoryDescription:
            description || undefined,
        },
      );

      await refreshCategories();
      setEditingCategory(null);
    } catch (err) {
      setEditError(
        err instanceof ApiError
          ? err.message
          : "ไม่สามารถแก้ไขหมวดหมู่ได้",
      );
    } finally {
      setEditSaving(false);
    }
  }

  function openDeleteModal(category: Category) {
    setDeletingCategory(category);
    setDeleteError(null);
  }

  function closeDeleteModal() {
    if (deleteSaving) return;

    setDeletingCategory(null);
    setDeleteError(null);
  }

  async function handleDeleteCategory() {
    if (!deletingCategory) return;

    try {
      setDeleteSaving(true);
      setDeleteError(null);

      await deleteCategory(
        deletingCategory.categoryId,
      );

      await refreshCategories();
      setDeletingCategory(null);
    } catch (err) {
      setDeleteError(
        err instanceof ApiError
          ? err.message
          : "ไม่สามารถลบหมวดหมู่ได้",
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
              จัดการหมวดหมู่
            </h1>

            <p className="mt-2 text-text-secondary">
              จัดการหมวดหมู่สำหรับจำแนกประเภทสิ่งของ
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            เพิ่มหมวดหมู่
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
              placeholder="ค้นหาหมวดหมู่..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl bg-surface">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-xl font-bold text-foreground">
              รายการหมวดหมู่
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              หมวดหมู่สิ่งของที่ใช้งานในระบบ
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center px-6 text-sm text-text-secondary">
              กำลังโหลดรายการหมวดหมู่...
            </div>
          ) : error ? (
            <div className="flex min-h-72 items-center justify-center px-6 text-center">
              <p className="text-sm text-danger">
                {error}
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-brand-yellow/25">
                <FolderCog
                  className="size-8 text-brand-purple"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-4 font-semibold text-foreground">
                ยังไม่มีหมวดหมู่ในระบบ
              </h3>

              <p className="mt-2 max-w-md text-sm text-text-secondary">
                API เชื่อมต่อสำเร็จแล้ว แต่ฐานข้อมูลยังไม่มีรายการหมวดหมู่
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="bg-surface-muted text-sm text-text-secondary">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      ชื่อหมวดหมู่
                    </th>
                    <th className="px-6 py-4 font-medium">
                      คำอธิบาย
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
                  {filteredCategories.map((category) => (
                    <tr key={category.categoryId}>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {category.categoryName}
                      </td>

                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {category.categoryDescription || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {category.categoryId}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(category)
                            }
                            className="inline-flex size-9 items-center justify-center rounded-lg text-brand-purple transition-colors hover:bg-brand-purple/10"
                            aria-label={`แก้ไข ${category.categoryName}`}
                          >
                            <Pencil
                              className="size-4"
                              aria-hidden="true"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal(category)
                            }
                            className="inline-flex size-9 items-center justify-center rounded-lg text-danger transition-colors hover:bg-danger/10"
                            aria-label={`ลบ ${category.categoryName}`}
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

              {filteredCategories.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-text-secondary">
                  ไม่พบหมวดหมู่ที่ตรงกับคำค้นหา
                </div>
              ) : null}
            </div>
          )}
        </section>
      </PageContainer>

      <Modal
        open={modalOpen}
        onClose={closeCreateModal}
        title="เพิ่มหมวดหมู่"
        description="สร้างหมวดหมู่สำหรับจำแนกประเภทสิ่งของในระบบ"
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
              form="create-category-form"
              disabled={saving || !categoryName.trim()}
              className="rounded-lg bg-brand-purple px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "กำลังบันทึก..."
                : "บันทึกหมวดหมู่"}
            </button>
          </>
        }
      >
        <form
          id="create-category-form"
          onSubmit={handleCreateCategory}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="category-name"
              className="text-sm font-medium text-foreground"
            >
              ชื่อหมวดหมู่
              <span className="ml-1 text-danger">*</span>
            </label>

            <input
              id="category-name"
              type="text"
              value={categoryName}
              onChange={(event) => {
                setCategoryName(event.target.value);
                setFormError(null);
              }}
              disabled={saving}
              placeholder="เช่น อุปกรณ์การเรียน"
              autoFocus
              className="mt-2 h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none transition-colors focus:border-brand-purple disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="category-description"
              className="text-sm font-medium text-foreground"
            >
              คำอธิบาย
            </label>

            <textarea
              id="category-description"
              value={categoryDescription}
              onChange={(event) => {
                setCategoryDescription(event.target.value);
                setFormError(null);
              }}
              disabled={saving}
              rows={4}
              placeholder="เช่น หนังสือ สมุด ปากกา ดินสอ"
              className="mt-2 w-full resize-none rounded-lg border border-border bg-surface p-3 text-sm outline-none transition-colors focus:border-brand-purple disabled:opacity-60"
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
        open={editingCategory !== null}
        onClose={closeEditModal}
        title="แก้ไขหมวดหมู่"
        description="แก้ไขชื่อและคำอธิบายของหมวดหมู่"
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
              form="edit-category-form"
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
          id="edit-category-form"
          onSubmit={handleUpdateCategory}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="edit-category-name"
              className="text-sm font-medium text-foreground"
            >
              ชื่อหมวดหมู่
              <span className="ml-1 text-danger">*</span>
            </label>

            <input
              id="edit-category-name"
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
              htmlFor="edit-category-description"
              className="text-sm font-medium text-foreground"
            >
              คำอธิบาย
            </label>

            <textarea
              id="edit-category-description"
              value={editDescription}
              onChange={(event) => {
                setEditDescription(event.target.value);
                setEditError(null);
              }}
              disabled={editSaving}
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-border bg-surface p-3 text-sm outline-none transition-colors focus:border-brand-purple disabled:opacity-60"
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
        open={deletingCategory !== null}
        onClose={closeDeleteModal}
        title="ยืนยันการลบหมวดหมู่"
        description="การลบหมวดหมู่อาจส่งผลต่อข้อมูลสิ่งของที่อ้างอิงหมวดหมู่นี้"
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
              onClick={() => void handleDeleteCategory()}
              disabled={deleteSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="size-4" />
              {deleteSaving
                ? "กำลังลบ..."
                : "ลบหมวดหมู่"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-danger/10 p-4">
            <p className="text-sm text-foreground">
              ต้องการลบหมวดหมู่
              <span className="font-semibold">
                {" "}
                {deletingCategory?.categoryName}
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
