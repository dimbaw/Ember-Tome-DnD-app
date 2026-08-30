import { createFileRoute, Outlet } from "@tanstack/react-router";
import { CampaignShell } from "@/components/shell";
import { useTome } from "@/lib/store";

export const Route = createFileRoute("/tome/$campaignId")({
  component: CampaignLayout,
});

function CampaignLayout() {
  const { campaignId } = Route.useParams();
  const campaign = useTome((s) => s.campaigns.find((c) => c.id === campaignId));

  if (!campaign) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-4">
        <h1 className="font-display text-3xl">This tome is not on the shelf</h1>
        <p className="mt-3 text-muted">It may have been cleared from this browser.</p>
      </main>
    );
  }

  return (
    <CampaignShell campaignId={campaign.id} campaignName={campaign.name}>
      <Outlet />
    </CampaignShell>
  );
}
