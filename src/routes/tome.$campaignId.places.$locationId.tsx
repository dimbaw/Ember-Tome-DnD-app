import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaEditor } from "@/components/media-editor";
import { makeLocation } from "@/lib/ai/fns";
import { animateStill } from "@/lib/craft";
import { withDirection } from "@/lib/art";
import { formatPlayed } from "@/lib/ids";
import { withNewVersion } from "@/lib/media";
import { kindLabel, LOCATION_KINDS } from "@/lib/places";
import { useTome } from "@/lib/store";
import type { LocationKind } from "@/lib/types";

export const Route = createFileRoute("/tome/$campaignId/places/$locationId")({
  component: PlacePage,
});

function PlacePage() {
  const { campaignId, locationId } = Route.useParams();
  const place = useTome((s) => s.locations.find((l) => l.id === locationId));
  const allSessions = useTome((s) => s.sessions);
  const sessions = allSessions
    .filter((s) => place?.sessionIds.includes(s.id))
    .sort((a, b) => a.number - b.number);
  const [editing, setEditing] = useState(false);

  if (!place) {
    return <p className="text-muted">This place is not in the atlas.</p>;
  }

  return (
    <article className="grid gap-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.18em] text-subtle uppercase">{kindLabel(place.kind)}</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">{place.name}</h1>
        </div>
        <Button variant={editing ? "subtle" : "outline"} onClick={() => setEditing((v) => !v)}>
          <Pencil className="size-4" />
          {editing ? "Done editing" : "Edit this place"}
        </Button>
      </div>

      <PlaceMedia locationId={place.id} />

      {editing ? (
        <PlaceForm locationId={place.id} campaignId={campaignId} />
      ) : (
        <>
          <p className="max-w-prose text-base leading-relaxed text-muted">{place.description}</p>
          {place.notes ? (
            <p className="max-w-prose whitespace-pre-line text-sm leading-relaxed text-muted">
              {place.notes}
            </p>
          ) : null}
        </>
      )}

      {sessions.length > 0 ? (
        <section>
          <h2 className="font-display text-xl">Nights here</h2>
          <ul className="mt-4 grid gap-2">
            {sessions.map((session) => (
              <li key={session.id}>
                <Link
                  to="/tome/$campaignId/session/$sessionId"
                  params={{ campaignId, sessionId: session.id }}
                  className="text-sm text-muted hover:text-fg"
                >
                  Session {session.number} · {session.title} · {formatPlayed(session.playedOn)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

function PlaceMedia({ locationId }: { locationId: string }) {
  const place = useTome((s) => s.locations.find((l) => l.id === locationId));
  const updateLocation = useTome((s) => s.updateLocation);
  if (!place) return null;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <MediaEditor
        kind="image"
        url={place.imageUrl}
        history={place.imageHistory}
        aspect="video"
        alt={place.name}
        generateLabel="Generate a new painting"
        emptyLabel="No painting yet."
        onChange={(imageUrl, imageHistory) => updateLocation(place.id, { imageUrl, imageHistory })}
        onGenerate={async (instruction) => {
          const made = await makeLocation({
            data: {
              name: place.name,
              description: withDirection(place.description, instruction),
              ref: place.imageUrl || undefined,
            },
          });
          if (!made.ok) throw new Error(made.error);
          return made.url;
        }}
        onAnimate={async (instruction) => {
          const next = await animateStill(place.imageUrl, place.description, instruction);
          const result = withNewVersion(place.videoUrl ?? "", place.videoHistory, next, "ai");
          updateLocation(place.id, { videoUrl: result.url, videoHistory: result.history });
        }}
      />
      <MediaEditor
        kind="video"
        url={place.videoUrl ?? ""}
        history={place.videoHistory}
        aspect="video"
        alt={place.name}
        generateLabel="Generate a moving view"
        emptyLabel="No animation yet. Generate from the painting."
        onChange={(videoUrl, videoHistory) =>
          updateLocation(place.id, { videoUrl: videoUrl || undefined, videoHistory })
        }
        onGenerate={async (instruction) => {
          if (!place.imageUrl) throw new Error("Paint the place first.");
          return animateStill(place.imageUrl, place.description, instruction);
        }}
      />
    </div>
  );
}

function PlaceForm({ locationId, campaignId }: { locationId: string; campaignId: string }) {
  const navigate = useNavigate();
  const place = useTome((s) => s.locations.find((l) => l.id === locationId));
  const updateLocation = useTome((s) => s.updateLocation);
  const removeLocation = useTome((s) => s.removeLocation);
  const [confirm, setConfirm] = useState(false);

  if (!place) return null;

  return (
    <div className="grid gap-6">
      <label className="grid gap-2 text-sm">
        <span className="text-muted">Name</span>
        <Input
          value={place.name}
          onChange={(e) => updateLocation(place.id, { name: e.target.value })}
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted">Kind</span>
        <select
          value={place.kind}
          onChange={(e) => updateLocation(place.id, { kind: e.target.value as LocationKind })}
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
        <span className="text-muted">Locked description</span>
        <Textarea
          value={place.description}
          onChange={(e) => updateLocation(place.id, { description: e.target.value })}
        />
        <span className="text-xs text-subtle">
          New paintings of this place use these words, and the current picture as the room.
        </span>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted">Notes</span>
        <Textarea
          value={place.notes}
          onChange={(e) => updateLocation(place.id, { notes: e.target.value })}
          className="min-h-28"
        />
      </label>
      {confirm ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted">Remove this place from the atlas?</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              removeLocation(place.id);
              navigate({ to: "/tome/$campaignId/places", params: { campaignId } });
            }}
          >
            Remove it
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setConfirm(false)}>
            Keep it
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="justify-self-start"
          onClick={() => setConfirm(true)}
        >
          Remove this place
        </Button>
      )}
    </div>
  );
}
