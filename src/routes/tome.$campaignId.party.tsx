import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/tome/$campaignId/party")({
  component: PartyLayout,
});

function PartyLayout() {
  return <Outlet />;
}
