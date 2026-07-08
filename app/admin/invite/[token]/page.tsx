import { AssistantInvitePage } from "@/components/crm/pages/assistant-invite-page";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function AssistantInviteRoute({ params }: PageProps) {
  const { token } = await params;
  return <AssistantInvitePage token={token} />;
}
