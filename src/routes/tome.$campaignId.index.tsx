import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaEditor } from "@/components/media-editor";
import { Portrait } from "@/components/portrait";
import { SceneFrame } from "@/components/scene-frame";
import { AddSceneForm, SceneCraft } from "@/components/scene-craft";
import { SessionFields } from "@/components/session-fields";
import { makeScene } from "@/lib/ai/fns";
import { animateStill } from "@/lib/craft";
import { withDirection } from "@/lib/art";
import { formatPlayed } from "@/lib/ids";
import { withNewVersion } from "@/lib/media";
import { useTome } from "@/lib/store";

export const Route = createFileRoute("/tome/$campaignId/")({
  component: Chronicle,
});

function Chronicle() {
  const { campaignId } = Route.useParams();
  const campaign = useTome((s) => s.campaigns.find((c) => c.id === campaignId));
  const allSessions = useTome((s) => s.sessions);
  const allScenes = useTome((s) => s.scenes);
  const allCharacters = useTome((s) => s.characters);
  const sessions = allSessions
    .filter((x) => x.campaignId === campaignId)
    .sort((a, b) => a.number - b.number);
  const scenes = allScenes.filter((x) => x.campaignId === campaignId);
  const characters = allCharacters.filter((c) => c.campaignId === campaignId);
  const allLocations = useTome((s) => s.locations);
  const locations = allLocations.filter((l) => l.campaignId === campaignId);
  const [editing, setEditing] = useState(false);

  if (!campaign) return null;

  return (
    <article>
      <header className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          {editing ? (
            <CampaignEdit campaignId={campaignId} />
          ) : (
            <>
              <p className="text-xs tracking-[0.22em] text-muted uppercase">{campaign.world}</p>
              <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{campaign.name}</h1>
              <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">
                {campaign.premise}
              </p>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <Button variant={editing ? "subtle" : "outline"} onClick={() => setEditing((v) => !v)}>
            <Pencil className="size-4" />
            {editing ? "Done editing" : "Edit the chronicle"}
          </Button>
          <Button asChild>
            <Link to="/tome/$campaignId/record" params={{ campaignId }}>
              <Mic className="size-4" />
              Record a session
            </Link>
          </Button>
        </div>
      </header>

      {editing ? (
        <section className="mt-10 max-w-3xl">
          <p className="mb-3 text-xs tracking-[0.16em] text-subtle uppercase">Cover</p>
          <MediaEditor
            kind="image"
            url={campaign.coverUrl}
            history={campaign.coverHistory}
            aspect="video"
            alt={campaign.name}
            generateLabel="Generate a new cover"
            emptyLabel="No cover yet."
            onChange={(coverUrl, coverHistory) =>
              useTome.getState().updateCampaign(campaignId, { coverUrl, coverHistory })
            }
            onGenerate={async (instruction) => {
              const pcs = characters.filter((c) => c.kind === "pc" && c.portraitUrl).slice(0, 3);
              const made = await makeScene({
                data: {
                  beat: withDirection(
                    `Campaign cover for ${campaign.name} in ${campaign.world}. ${campaign.premise}. Cinematic still, no readable text.`,
                    instruction,
                  ),
                  appearances: pcs.map((c) => `${c.name}: ${c.appearance}`),
                  refs: pcs.map((c) => c.portraitUrl),
                },
              });
              if (!made.ok) throw new Error(made.error);
              return made.url;
            }}
            onAnimate={async (instruction) => {
              if (!campaign.coverUrl) throw new Error("Paint a cover first.");
              const next = await animateStill(
                campaign.coverUrl,
                `${campaign.name}. ${campaign.premise}`,
                instruction,
              );
              const result = withNewVersion(
                campaign.coverVideoUrl ?? "",
                campaign.coverVideoHistory,
                next,
                "ai",
              );
              useTome.getState().updateCampaign(campaignId, {
                coverVideoUrl: result.url,
                coverVideoHistory: result.history,
              });
            }}
          />
          <div className="mt-8">
            <p className="mb-3 text-xs tracking-[0.16em] text-subtle uppercase">Cover, moving</p>
            <MediaEditor
              kind="video"
              url={campaign.coverVideoUrl ?? ""}
              history={campaign.coverVideoHistory}
              aspect="video"
              alt={campaign.name}
              generateLabel="Generate a new cover video"
              emptyLabel="No moving cover yet. Animate the still, or generate here."
              onChange={(coverVideoUrl, coverVideoHistory) =>
                useTome.getState().updateCampaign(campaignId, {
                  coverVideoUrl: coverVideoUrl || undefined,
                  coverVideoHistory,
                })
              }
              onGenerate={async (instruction) => {
                if (!campaign.coverUrl) throw new Error("Paint a cover first.");
                return animateStill(
                  campaign.coverUrl,
                  `${campaign.name}. ${campaign.premise}`,
                  instruction,
                );
              }}
            />
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {characters
            .filter((c) => c.kind === "pc")
            .map((c) => (
              <Link
                key={c.id}
                to="/tome/$campaignId/party/$characterId"
                params={{ campaignId, characterId: c.id }}
                className="w-28 shrink-0"
              >
                <div className="aspect-portrait overflow-hidden rounded-lg">
                  {c.portraitUrl ? <Portrait character={c} sizes="112px" /> : <div className="h-full bg-elevated" />}
                </div>
                <p className="mt-2 truncate font-display text-sm">{c.name}</p>
                <p className="truncate text-xs text-subtle">{c.classOrRole}</p>
              </Link>
            ))}
        </div>
      </section>

      {sessions.length === 0 ? (
        <EmptyChronicle campaignId={campaignId} />
      ) : (
        <div className="mt-14 grid gap-20">
          {sessions.map((session) => {
            const sessionScenes = scenes.filter((s) => s.sessionId === session.id);
            const involved = characters.filter((c) => session.characterIds.includes(c.id));
            const sessionPlaces = locations.filter((l) =>
              (session.locationIds ?? []).includes(l.id),
            );
            return (
              <section key={session.id} className="grid gap-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs tracking-[0.18em] text-subtle uppercase">
                      Session {String(session.number).padStart(2, "0")} · {formatPlayed(session.playedOn)}
                    </p>
                    <h2 className="mt-2 font-display text-3xl">{session.title}</h2>
                  </div>
                  <Link
                    to="/tome/$campaignId/session/$sessionId"
                    params={{ campaignId, sessionId: session.id }}
                    className="text-sm text-muted hover:text-fg"
                  >
                    Open the night
                  </Link>
                </div>
                {editing ? (
                  <div className="grid gap-6">
                    <SessionFields session={session} />
                    {sessionScenes.map((scene) => (
                      <SceneCraft key={scene.id} scene={scene} />
                    ))}
                    <AddSceneForm campaignId={campaignId} sessionId={session.id} />
                  </div>
                ) : (
                  <>
                    {sessionScenes[0] ? (
                      <SceneFrame scene={sessionScenes[0]} eager={session.number === 1} />
                    ) : null}
                    <p className="max-w-prose text-base leading-relaxed text-muted">
                      {session.summary}
                    </p>
                    {sessionScenes.length > 1 ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {sessionScenes.slice(1).map((scene) => (
                          <div key={scene.id}>
                            <SceneFrame scene={scene} />
                            <p className="mt-2 font-display text-base">{scene.title}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div className="flex flex-wrap gap-2">
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
                    {sessionPlaces.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {sessionPlaces.map((place) => (
                          <Link
                            key={place.id}
                            to="/tome/$campaignId/places/$locationId"
                            params={{ campaignId, locationId: place.id }}
                            className="overflow-hidden rounded-lg bg-elevated"
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
                    ) : null}
                  </>
                )}
              </section>
            );
          })}
        </div>
      )}
    </article>
  );
}

function CampaignEdit({ campaignId }: { campaignId: string }) {
  const campaign = useTome((s) => s.campaigns.find((c) => c.id === campaignId));
  const updateCampaign = useTome((s) => s.updateCampaign);
  if (!campaign) return null;
  return (
    <div className="grid gap-4">
      <label className="grid gap-2 text-sm">
        <span className="text-muted">World</span>
        <Input
          value={campaign.world}
          onChange={(e) => updateCampaign(campaignId, { world: e.target.value })}
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted">Campaign</span>
        <Input
          value={campaign.name}
          onChange={(e) => updateCampaign(campaignId, { name: e.target.value })}
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted">Premise</span>
        <Textarea
          value={campaign.premise}
          onChange={(e) => updateCampaign(campaignId, { premise: e.target.value })}
          className="min-h-28"
        />
      </label>
    </div>
  );
}

function EmptyChronicle({ campaignId }: { campaignId: string }) {
  return (
    <div className="mt-16 max-w-lg rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
      <h2 className="font-display text-2xl">The pages are still blank</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Record the next night at the table, or paste the session notes. Faces that
        already live in this tome will be drawn the same way again.
      </p>
      <Button asChild className="mt-6">
        <Link to="/tome/$campaignId/record" params={{ campaignId }}>
          Record a session
        </Link>
      </Button>
    </div>
  );
}
