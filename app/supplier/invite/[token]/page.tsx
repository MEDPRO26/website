import { SupplierInvitePage } from "@/components/crm/pages/supplier-invite-page";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function SupplierInviteRoute({ params }: PageProps) {
  const { token } = await params;
  return <SupplierInvitePage token={token} />;
}
