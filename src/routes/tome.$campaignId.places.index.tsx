import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { makeLocation } from "@/lib/ai/fns";
import { nid } from "@/lib/ids";
import { kindLabel, LOCATION_KINDS } from "@/lib/places";
import { useTome } from "@/lib/store";
import type { Location, LocationKind } from "@/lib/types";

export const Route = createFileRoute("/tome/$campaignId/places/")({
  component: Places,
});

function Places() {
  const { campaignId } = Route.useParams();
  const allLocations = useTome((s) => s.locations);
  const locations = allLocations.filter((l) => l.campaignId === campaignId);

  return (
    <div>
      <header>
        <p className="text-xs tracking-[0.22em] text-muted uppercase">The atlas</p>
        <h1 className="mt-2 font-display text-4xl">Places</h1>
        <p className="mt-3 max-w-prose text-muted">
          When the DM describes a room, a road, a tomb — it is painted here, as they said it.
        </p>
      </header>

      {locations.length === 0 ? (
        <p className="mt-12 max-w-prose text-muted">
          No places yet. Record a night, or add one the table already knows.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {locations.map((place) => (
            <PlaceCard key={place.id} place={place} campaignId={campaignId} />
          ))}
        </div>
      )}

      <AddPlace campaignId={campaignId} />
    </div>
  );
}

function PlaceCard({ place, campaignId }: { place: Location; campaignId: string }) {
  return (
    <Link
      to="/tome/$campaignId/places/$locationId"
      params={{ campaignId, locationId: place.id }}
      className="group block"
    >
      <div className="overflow-hidden rounded-xl bg-elevated">
        {place.imageUrl ? (
          <img
            src={place.imageUrl}
            alt={place.name}
            className="aspect-video w-full object-cover transition-transform duration-500 ease-[var(--ease-out-smooth)] group-hover:scale-[1.02]"
          />
        ) : (
          <div className="aspect-video bg-elevated" />
        )}
      </div>
      <p className="mt-3 text-xs tracking-[0.16em] text-subtle uppercase">{kindLabel(place.kind)}</p>
      <p className="mt-1 font-display text-xl leading-tight">{place.name}</p>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{place.description}</p>
    </Link>
  );
}

function AddPlace({ campaignId }: { campaignId: string }) {
  const navigate = useNavigate();
  const addLocation = useTome((s) => s.addLocation);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<LocationKind>("landmark");
  const [description, setDescription] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error("Name the place and describe it as the DM would.");
      return;
    }
    setBusy(true);
    let imageUrl = "";
    const made = await makeLocation({
      data: { name: name.trim(), description: description.trim() },
    });
    if (made.ok) imageUrl = made.url;
    else toast.error(made.error);
    const id = nid("loc");
    addLocation({
      id,
      campaignId,
      name: name.trim(),
      kind,
      description: description.trim(),
      notes: "",
      imageUrl,
      imageHistory: imageUrl
        ? [{ id: nid("media"), url: imageUrl, createdAt: new Date().toISOString(), source: "ai" }]
        : [],
      videoHistory: [],
      firstSeenSessionId: null,
      sessionIds: [],
    });
    navigate({
      to: "/tome/$campaignId/places/$locationId",
      params: { campaignId, locationId: id },
    });
  }

  if (!open) {
    return (
      <Button variant="outline" className="mt-12" onClick={() => setOpen(true)}>
        Add a place to the atlas
      </Button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-12 max-w-xl rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
    >
      <h2 className="font-display text-2xl">Add a place</h2>
      <p className="mt-2 text-sm text-muted">
        Write it as the DM said it. Later nights will keep this look.
      </p>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm">
          <span className="text-muted">Name</span>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-muted">Kind</span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as LocationKind)}
            className="flex h-11 w-full rounded-lg bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {LOCATION_KINDS.map((k) => (
              <option key={k} value={k}>
                {kindLabel(k)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-muted">What the DM described</span>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Light, weather, stone, the one detail a painter should never lose."
            required
          />
        </label>
        <Button type="submit" disabled={busy}>
          {busy ? "Painting the place…" : "Paint this place"}
        </Button>
      </div>
    </form>
  );
}
