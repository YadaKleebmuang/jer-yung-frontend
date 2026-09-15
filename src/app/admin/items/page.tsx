import { ItemsListView } from "@/features/items/ItemsListView";

export const dynamic = "force-dynamic";

export interface AdminItemsPageProps {
  searchParams: Promise<{
    type?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function AdminItemsPage({
  searchParams,
}: AdminItemsPageProps) {
  const params = await searchParams;

  return (
    <ItemsListView
      searchParams={params}
      basePath="/admin/items"
    />
  );
}
