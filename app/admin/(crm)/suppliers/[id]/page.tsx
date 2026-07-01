import { AdminSupplierDetailPage } from "@/components/crm/pages/admin-supplier-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminSupplierDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <AdminSupplierDetailPage supplierId={id} />;
}
