"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { X, ImagePlus, Trash2, MapPin } from "lucide-react";

import { type TransactionItemListItem } from "@/types/transaction-item";
import { type Category } from "@/types/category";
import { type Location } from "@/types/location";
import { getCategories } from "@/services/category.service";
import { getLocations } from "@/services/location.service";
import { updateTransactionItem, deleteTransactionItem } from "@/services/transaction-item.service";

export interface UserEditPostModalProps {
  item: TransactionItemListItem;
  onClose: () => void;
  onSaved: (item: TransactionItemListItem) => void;
}

export function UserEditPostModal({
  item,
  onClose,
  onSaved,
}: UserEditPostModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentStatus, setCurrentStatus] = useState<string>(item.currentStatus ?? "PENDING");
  
  const [itemName, setItemName] = useState(item.transactionItemsName);
  const [categoryId, setCategoryId] = useState<number | "">(item.categories?.categoryId ?? "");
  const [locationId, setLocationId] = useState<number | "">(item.location?.locationId ?? "");
  const [itemDate, setItemDate] = useState(() => {
    if (!item.transactionItemsDate) return "";
    return new Date(item.transactionItemsDate).toISOString().slice(0, 16);
  });
  const [itemDetails, setItemDetails] = useState(() => {
    const details = item.transactionItemsLocationDetails ?? "";
    // Clean up backend auto-appended string like "(ผู้เก็บได้: ก้องเกียรติ จันทร์ทุม)"
    return details.replace(/\s*\(ผู้เก็บได้:[^)]+\)/g, "").trim();
  });

  const [existingImages, setExistingImages] = useState<string[]>(item.imageUrl || []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const [cats, locs] = await Promise.all([
          getCategories(),
          getLocations()
        ]);
        setCategories(cats);
        setLocations(locs);
      } catch (err) {
        console.error("Failed to load categories/locations", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleAddImages(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const totalImages = existingImages.length + newImages.length + filesArray.length;
      if (totalImages > 5) {
        alert("อัปโหลดได้สูงสุด 5 รูปภาพเท่านั้น");
        return;
      }
      setNewImages((prev) => [...prev, ...filesArray]);
    }
  }

  function handleRemoveExistingImage(index: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleRemoveNewImage(index: number) {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!itemName.trim()) {
      setError("กรุณากรอกชื่อสิ่งของ");
      return;
    }
    if (categoryId === "") {
      setError("กรุณาเลือกหมวดหมู่");
      return;
    }
    if (locationId === "") {
      setError("กรุณาเลือกสถานที่");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("itemName", itemName);
      formData.append("itemDetails", itemDetails);
      formData.append("categoryId", String(categoryId));
      formData.append("locationId", String(locationId));
      formData.append("currentStatus", currentStatus);

      // Only changing storageType to CENTRAL if IN_CENTER is selected, else keep original
      if (currentStatus === "IN_CENTER") {
        formData.append("storageType", "CENTRAL");
      } else if (item.transactionItemsStorageType && item.transactionItemsStorageType !== "null") {
        formData.append("storageType", item.transactionItemsStorageType);
      } else {
        formData.append("storageType", "SELF"); // Default fallback
      }

      // Append finderName if available (defaulting to current user)
      if (item.users?.userName) {
        formData.append("finderName", item.users.userName);
      }
      
      if (itemDate) {
        formData.append("itemDate", new Date(itemDate).toISOString());
      }

      // 1. Fetch existing images and convert them to File objects
      // Because the backend completely replaces the images list with whatever is in `newImages`
      for (const imgPath of existingImages) {
        try {
          const url = getImageUrl(imgPath);
          const res = await fetch(url);
          if (res.ok) {
            const blob = await res.blob();
            const filename = imgPath.split('/').pop() || 'existing-image.png';
            const file = new File([blob], filename, { type: blob.type || 'image/png' });
            formData.append("newImages", file);
          }
        } catch (err) {
          console.error("Failed to fetch existing image to re-upload:", imgPath, err);
        }
      }

      // 2. Append the actual new images selected by the user
      newImages.forEach((file) => {
        formData.append("newImages", file);
      });

      // Optional: If API supported deleting existing images, we would send existingImages here.
      // Since it's unspecified, we just send newImages for now.

      await updateTransactionItem(item.transactionItemId, formData);
      onSaved(item);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
      return;
    }

    setDeleting(true);
    setError(null);
    try {
      await deleteTransactionItem(item.transactionItemId);
      onSaved(item); // Trigger refresh
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการลบโพสต์");
      setDeleting(false);
    }
  }

  const getImageUrl = (path: string) => {
    const baseUrl = (process.env.NEXT_PUBLIC_API_PROXY_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    return `${baseUrl}/api/images/${path}`;
  };

  const isLost = item.transactionItemsPostType === "LOST";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-brand-purple/10 px-3 py-1.5 text-brand-purple">
              <PencilIcon className="size-4" />
              <span className="font-bold">แก้ไขโพสต์ของฉัน</span>
            </div>
            <span className="rounded-md bg-surface-muted px-2 py-1 text-xs text-text-secondary">
              รหัส: {item.transactionItemReferenceTag || `JY-${item.transactionItemId}`}
            </span>
            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isLost ? 'bg-brand-purple/10 text-brand-purple' : 'bg-brand-yellow/20 text-yellow-700'}`}>
              <div className={`size-1.5 rounded-full ${isLost ? 'bg-brand-purple' : 'bg-yellow-600'}`} />
              {isLost ? "ของหาย" : "เจอของ"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg bg-surface-muted text-text-secondary hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </header>

        {/* Content */}
        <form onSubmit={handleSave} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 overflow-hidden lg:flex-row">
            {/* Left Column */}
            <div className="flex-1 overflow-y-auto border-r border-border bg-surface-muted/30 p-6 space-y-6">
              
              {/* Post Status */}
              <section className="rounded-xl border border-border bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <StatusIcon className="size-4 text-brand-purple" />
                    สถานะโพสต์
                  </h3>
                  <span className="text-xs text-text-secondary">คลิกเพื่ออัปเดต</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <StatusButton 
                    label={isLost ? "กำลังตามหา" : "กำลังตามหาเจ้าของ"} 
                    isActive={currentStatus === "PENDING"}
                    onClick={() => setCurrentStatus("PENDING")}
                    colorClass="bg-brand-purple"
                  />
                  <StatusButton 
                    label={isLost ? "ได้รับคืนแล้ว" : "ส่งมอบแล้ว"} 
                    isActive={currentStatus === "RETURNED"}
                    onClick={() => setCurrentStatus("RETURNED")}
                    colorClass="bg-green-500"
                  />
                  <StatusButton 
                    label="อยู่ที่ส่วนกลาง" 
                    isActive={currentStatus === "IN_CENTER"}
                    onClick={() => setCurrentStatus("IN_CENTER")}
                    colorClass="bg-gray-400"
                  />
                </div>
              </section>

              {/* Images */}
              <section className="rounded-xl border border-border bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <ImagePlus className="size-4 text-brand-purple" />
                    รูปภาพสิ่งของ ({existingImages.length + newImages.length}/5)
                  </h3>
                  <span className="text-xs text-text-secondary">สูงสุด 5 ภาพ</span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((img, i) => (
                    <div key={i} className="relative size-20 rounded-lg border border-border overflow-hidden group">
                      <Image src={getImageUrl(img)} alt="" fill className="object-cover" />
                      <button type="button" onClick={() => handleRemoveExistingImage(i)} className="absolute right-1 top-1 rounded-full bg-white/80 p-0.5 text-danger opacity-0 transition-opacity group-hover:opacity-100">
                        <X className="size-3" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-brand-purple/80 text-center text-[10px] text-white">รูปหลัก</span>
                      )}
                    </div>
                  ))}

                  {newImages.map((file, i) => (
                    <div key={i} className="relative size-20 rounded-lg border border-border overflow-hidden group">
                      <Image src={URL.createObjectURL(file)} alt="" fill className="object-cover" />
                      <button type="button" onClick={() => handleRemoveNewImage(i)} className="absolute right-1 top-1 rounded-full bg-white/80 p-0.5 text-danger opacity-0 transition-opacity group-hover:opacity-100">
                        <X className="size-3" />
                      </button>
                      <span className="absolute bottom-0 left-0 right-0 bg-brand-yellow/80 text-center text-[10px] text-black">ใหม่</span>
                    </div>
                  ))}

                  {(existingImages.length + newImages.length) < 5 && (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex size-20 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-text-secondary transition-colors hover:border-brand-purple hover:bg-brand-purple/5 hover:text-brand-purple">
                      <ImagePlus className="size-5 mb-1" />
                      <span className="text-[10px]">เพิ่มรูป</span>
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleAddImages} className="hidden" />
                </div>
              </section>

              {/* Contact Info */}
              <section className="rounded-xl border border-border bg-white p-4">
                <h3 className="mb-4 font-bold text-foreground flex items-center gap-2">
                  <ContactIcon className="size-4 text-brand-purple" />
                  ช่องทางติดต่อเจ้าของโพสต์
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-secondary">ชื่อผู้ติดต่อ</label>
                    <input type="text" readOnly value={item.users?.userName || ""} className="mt-1 w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-text-secondary outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary">เบอร์โทร / LINE ID</label>
                    <input type="text" readOnly value={item.users?.userPhoneNumber || item.users?.userLineId || "ไม่ระบุ"} className="mt-1 w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-text-secondary outline-none" />
                  </div>
                </div>
              </section>

            </div>

            {/* Right Column */}
            <div className="flex-[1.2] overflow-y-auto bg-white p-6">
              <h3 className="mb-4 font-bold text-foreground flex items-center gap-2">
                <BoxIcon className="size-4 text-brand-purple" />
                ข้อมูลและรายละเอียดสิ่งของ
              </h3>
              
              {error && <div className="mb-4 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-secondary">ชื่อสิ่งของ / ยี่ห้อ / รุ่น <span className="text-danger">*</span></label>
                    <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} required className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-purple" />
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary">หมวดหมู่สิ่งของ <span className="text-danger">*</span></label>
                    <select value={categoryId} onChange={e => setCategoryId(Number(e.target.value))} required className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-purple">
                      <option value="">เลือกหมวดหมู่</option>
                      {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-text-secondary">สถานที่เกิดเหตุใน มรภ.บุรีรัมย์ <span className="text-danger">*</span></label>
                    <select value={locationId} onChange={e => setLocationId(Number(e.target.value))} required className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-purple">
                      <option value="">เลือกสถานที่</option>
                      {locations.map(l => <option key={l.locationId} value={l.locationId}>{l.locationName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary">วันและเวลาที่ทำหาย / ที่พบ</label>
                    <input type="datetime-local" value={itemDate} onChange={e => setItemDate(e.target.value)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-purple" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-secondary">ลักษณะเด่น / ตำหนิ / รายละเอียดเฉพาะ</label>
                  <textarea rows={6} value={itemDetails} onChange={e => setItemDetails(e.target.value)} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-purple resize-none"></textarea>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="flex items-center justify-between border-t border-border bg-surface px-6 py-4 shrink-0">
            <button type="button" onClick={handleDelete} disabled={deleting || saving} className="inline-flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 px-4 py-2 text-sm font-semibold text-danger transition-colors hover:bg-danger/10 disabled:opacity-50">
              <Trash2 className="size-4" />
              {deleting ? "กำลังลบ..." : "ลบโพสต์นี้"}
            </button>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} disabled={saving || deleting} className="rounded-lg bg-surface-muted px-4 py-2 text-sm font-semibold text-text-secondary hover:text-foreground disabled:opacity-50">
                ยกเลิก
              </button>
              <button type="submit" disabled={saving || deleting || !itemName.trim()} className="rounded-lg bg-brand-purple px-4 py-2 text-sm font-semibold text-white hover:bg-brand-purple/90 disabled:opacity-50">
                {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}

function StatusButton({ label, isActive, onClick, colorClass }: { label: string, isActive: boolean, onClick: () => void, colorClass: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-12 flex-col items-center justify-center rounded-lg border text-xs font-medium transition-colors ${isActive ? 'border-brand-purple bg-brand-purple/5 text-brand-purple' : 'border-border bg-white text-text-secondary hover:bg-surface-muted'}`}
    >
      <div className={`mb-1 size-2 rounded-full ${isActive ? colorClass : 'bg-gray-300'}`} />
      {label}
    </button>
  );
}

// Simple Icon placeholders to match design
const PencilIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const StatusIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const ContactIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const BoxIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
