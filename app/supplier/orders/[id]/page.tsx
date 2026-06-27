import { SupplierOrderDetailPage } from "@/components/crm/pages/supplier-order-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SupplierOrderDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <SupplierOrderDetailPage orderId={id} />;
}
