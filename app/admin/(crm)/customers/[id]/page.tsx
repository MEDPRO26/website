import { AdminCustomerDetailPage } from "@/components/crm/pages/admin-customer-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCustomerDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <AdminCustomerDetailPage customerId={id} />;
}
