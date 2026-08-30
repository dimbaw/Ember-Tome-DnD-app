import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/tome/$campaignId/places")({
  component: PlacesLayout,
});

function PlacesLayout() {
  return <Outlet />;
}
