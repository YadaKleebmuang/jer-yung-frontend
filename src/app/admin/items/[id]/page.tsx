import { ItemDetailView } from "@/features/items/ItemDetailView";

export const dynamic = "force-dynamic";

export interface AdminItemDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminItemDetailPage({
  params,
}: AdminItemDetailPageProps) {
  const { id } = await params;

  return (
    <ItemDetailView
      id={id}
      basePath="/admin/items"
    />
  );
}
