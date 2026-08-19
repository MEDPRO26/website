import { ApporteurInvitePage } from "@/components/crm/pages/apporteur-invite-page";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function ApporteurInviteRoute({ params }: PageProps) {
  const { token } = await params;
  return <ApporteurInvitePage token={token.trim()} />;
}
