import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Portrait } from "@/components/portrait";
import { SceneFrame } from "@/components/scene-frame";
import { AddSceneForm, SceneCraft } from "@/components/scene-craft";
import { SessionFields } from "@/components/session-fields";
import { formatPlayed } from "@/lib/ids";
import { useTome } from "@/lib/store";

export const Route = createFileRoute("/tome/$campaignId/session/$sessionId")({
  component: SessionPage,
});

function SessionPage() {
  const { campaignId, sessionId } = Route.useParams();
  const session = useTome((s) => s.sessions.find((x) => x.id === sessionId));
  const allScenes = useTome((s) => s.scenes);
  const allCharacters = useTome((s) => s.characters);
  const allLocations = useTome((s) => s.locations);
  const scenes = allScenes.filter((x) => x.sessionId === sessionId);
  const characters = allCharacters.filter((c) => c.campaignId === campaignId);
  const [editing, setEditing] = useState(false);

  if (!session) return <p className="text-muted">This night is not bound.</p>;

  const involved = characters.filter((c) => session.characterIds.includes(c.id));
  const places = allLocations.filter((l) => (session.locationIds ?? []).includes(l.id));

  return (
    <article>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.18em] text-subtle uppercase">
            Session {String(session.number).padStart(2, "0")} · {formatPlayed(session.playedOn)}
          </p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">{session.title}</h1>
        </div>
        <Button variant={editing ? "subtle" : "outline"} onClick={() => setEditing((v) => !v)}>
          <Pencil className="size-4" />
          {editing ? "Done editing" : "Edit this night"}
        </Button>
      </div>

      {editing ? (
        <div className="mt-8 grid gap-8">
          <SessionFields session={session} />
          {scenes.map((scene) => (
            <SceneCraft key={scene.id} scene={scene} />
          ))}
          <AddSceneForm campaignId={campaignId} sessionId={session.id} />
        </div>
      ) : (
        <>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-muted">{session.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {involved.map((c) => (
              <Link
                key={c.id}
                to="/tome/$campaignId/party/$characterId"
                params={{ campaignId, characterId: c.id }}
                className="flex items-center gap-2 rounded-full bg-elevated py-1 pr-3 pl-1 text-xs text-muted"
              >
                <span className="size-6 overflow-hidden rounded-full">
                  {c.portraitUrl ? <Portrait character={c} sizes="24px" /> : null}
                </span>
                {c.name}
              </Link>
            ))}
          </div>
          {places.length > 0 ? (
            <section className="mt-8">
              <p className="text-xs tracking-[0.16em] text-subtle uppercase">Places this night</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {places.map((place) => (
                  <Link
                    key={place.id}
                    to="/tome/$campaignId/places/$locationId"
                    params={{ campaignId, locationId: place.id }}
                    className="group block overflow-hidden rounded-xl bg-elevated"
                  >
                    {place.imageUrl ? (
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="aspect-video w-full object-cover"
                      />
                    ) : null}
                    <p className="px-3 py-2 font-display text-sm">{place.name}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
          <div className="mt-10 grid gap-10">
            {scenes.map((scene) => (
              <figure key={scene.id} className="grid gap-3">
                <SceneFrame scene={scene} />
                <figcaption>
                  <p className="font-display text-xl">{scene.title}</p>
                  <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted">{scene.beat}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          {session.events.length > 0 ? (
            <section className="mt-12 max-w-prose">
              <h2 className="font-display text-2xl">What the table did</h2>
              <ol className="mt-4 grid gap-3">
                {session.events.map((event) => (
                  <li key={event.id} className="text-sm leading-relaxed text-muted">
                    {event.text}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </>
      )}
    </article>
  );
}
