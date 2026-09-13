import { Badge } from "@/components/ui/Badge";

export type ItemStatus =
  | "searching"
  | "found"
  | "waiting_owner"
  | "at_storage"
  | "contacting_owner"
  | "returned"
  | "closed";

const statusConfig: Record<
  ItemStatus,
  {
    label: string;
    variant:
      | "neutral"
      | "purple"
      | "yellow"
      | "success"
      | "danger"
      | "info";
  }
> = {
  searching: {
    label: "กำลังตามหา",
    variant: "purple",
  },
  found: {
    label: "พบสิ่งของแล้ว",
    variant: "info",
  },
  waiting_owner: {
    label: "รอเจ้าของติดต่อ",
    variant: "yellow",
  },
  at_storage: {
    label: "อยู่ที่ส่วนกลาง",
    variant: "yellow",
  },
  contacting_owner: {
    label: "กำลังติดต่อเจ้าของ",
    variant: "info",
  },
  returned: {
    label: "ส่งคืนสำเร็จ",
    variant: "success",
  },
  closed: {
    label: "ปิดรายการ",
    variant: "neutral",
  },
};

export interface StatusBadgeProps {
  status: ItemStatus;
}

export function StatusBadge({
  status,
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}
