import { AdminOrderDetailPage } from "@/components/crm/pages/admin-order-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <AdminOrderDetailPage orderId={id} />;
}
