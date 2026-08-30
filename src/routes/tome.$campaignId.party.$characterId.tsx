import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AddMediaButton, MediaEditor } from "@/components/media-editor";
import { SceneFrame } from "@/components/scene-frame";
import { makePortrait } from "@/lib/ai/fns";
import { animateStill } from "@/lib/craft";
import { withDirection } from "@/lib/art";
import { formatPlayed } from "@/lib/ids";
import { makeVersion } from "@/lib/media";
import { useTome } from "@/lib/store";
import type { CharacterKind, CharacterStatus, GalleryItem } from "@/lib/types";

export const Route = createFileRoute("/tome/$campaignId/party/$characterId")({
  component: CharacterPage,
});

function CharacterPage() {
  const { campaignId, characterId } = Route.useParams();
  const character = useTome((s) => s.characters.find((c) => c.id === characterId));
  const allSessions = useTome((s) => s.sessions);
  const allScenes = useTome((s) => s.scenes);
  const sessions = allSessions
    .filter((x) => x.campaignId === campaignId)
    .sort((a, b) => a.number - b.number);
  const scenes = allScenes.filter(
    (x) => x.campaignId === campaignId && x.characterIds.includes(characterId),
  );
  const [editing, setEditing] = useState(false);

  if (!character) {
    return <p className="text-muted">This face is not in the tome.</p>;
  }

  const timeline = sessions.flatMap((session) =>
    session.events
      .filter((e) => e.characterIds.includes(characterId))
      .map((event) => ({ session, event })),
  );

  return (
    <article className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <aside>
        <MediaEditor
          kind="image"
          url={character.portraitUrl}
          history={character.portraitHistory}
          aspect="portrait"
          alt={character.name}
          generateLabel="Generate a new portrait"
          emptyLabel="No portrait yet."
          onChange={(portraitUrl, portraitHistory) =>
            useTome.getState().updateCharacter(character.id, { portraitUrl, portraitHistory })
          }
          onGenerate={async (instruction) => {
            const made = await makePortrait({
              data: {
                appearance: withDirection(character.appearance, instruction),
                ref: character.portraitUrl || undefined,
              },
            });
            if (!made.ok) throw new Error(made.error);
            return made.url;
          }}
          onAnimate={async (instruction) => {
            if (!character.portraitUrl) throw new Error("Paint a portrait first.");
            const next = await animateStill(
              character.portraitUrl,
              `${character.name}, ${character.appearance}`,
              instruction,
            );
            const item: GalleryItem = { ...makeVersion(next, "ai"), kind: "video" };
            useTome.getState().updateCharacter(character.id, {
              gallery: [...(character.gallery ?? []), item],
            });
          }}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{character.kind === "pc" ? "Party" : "World"}</Badge>
          <Badge>{character.status}</Badge>
        </div>
        <Button
          variant={editing ? "subtle" : "outline"}
          className="mt-4 w-full"
          onClick={() => setEditing((v) => !v)}
        >
          <Pencil className="size-4" />
          {editing ? "Done editing" : "Edit this face"}
        </Button>
      </aside>
      <div>
        {editing ? (
          <CharacterForm characterId={character.id} campaignId={campaignId} />
        ) : (
          <>
            <p className="text-xs tracking-[0.18em] text-subtle uppercase">
              {character.race} · {character.classOrRole}
            </p>
            <h1 className="mt-2 font-display text-4xl">{character.name}</h1>
            {character.notes ? (
              <p className="mt-4 max-w-prose whitespace-pre-line text-base leading-relaxed text-muted">
                {character.notes}
              </p>
            ) : null}
            <section className="mt-8">
              <h2 className="font-display text-xl">Locked appearance</h2>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
                {character.appearance}
              </p>
            </section>
          </>
        )}

        {timeline.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-display text-xl">What happened</h2>
            <ol className="mt-4 grid gap-4">
              {timeline.map(({ session, event }) => (
                <li key={event.id} className="border-l border-border pl-4">
                  <Link
                    to="/tome/$campaignId/session/$sessionId"
                    params={{ campaignId, sessionId: session.id }}
                    className="text-xs text-subtle hover:text-fg"
                  >
                    Session {session.number} · {session.title} · {formatPlayed(session.playedOn)}
                  </Link>
                  <p className="mt-1 text-sm leading-relaxed text-fg">{event.text}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {scenes.length > 0 ? (
          <section className="mt-10">
            <h2 className="font-display text-xl">In the pictures</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {scenes.map((scene) => (
                <div key={scene.id}>
                  <SceneFrame scene={scene} />
                  <p className="mt-2 font-display">{scene.title}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}

function CharacterForm({
  characterId,
  campaignId,
}: {
  characterId: string;
  campaignId: string;
}) {
  const navigate = useNavigate();
  const character = useTome((s) => s.characters.find((c) => c.id === characterId));
  const updateCharacter = useTome((s) => s.updateCharacter);
  const removeCharacter = useTome((s) => s.removeCharacter);
  const [confirm, setConfirm] = useState(false);
  const [shotPrompt, setShotPrompt] = useState("");
  const [busyShot, setBusyShot] = useState<"image" | "video" | null>(null);

  if (!character) return null;
  const gallery = character.gallery ?? [];
  const face = character;

  async function addGeneratedShot() {
    setBusyShot("image");
    try {
      const extra = shotPrompt.trim();
      const appearance = extra
        ? withDirection(face.appearance, extra)
        : face.appearance;
      const made = await makePortrait({
        data: { appearance, ref: face.portraitUrl || undefined },
      });
      if (!made.ok) throw new Error(made.error);
      const item: GalleryItem = { ...makeVersion(made.url, "ai"), kind: "image" };
      updateCharacter(characterId, { gallery: [...gallery, item] });
      setShotPrompt("");
      toast.success("Another picture is bound.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not paint that shot");
    } finally {
      setBusyShot(null);
    }
  }

  async function addGeneratedVideo() {
    if (!face.portraitUrl) {
      toast.error("Paint a portrait first.");
      return;
    }
    setBusyShot("video");
    try {
      const url = await animateStill(
        face.portraitUrl,
        `${face.name}, ${face.appearance}`,
        shotPrompt.trim() || undefined,
      );
      const item: GalleryItem = { ...makeVersion(url, "ai"), kind: "video" };
      updateCharacter(characterId, { gallery: [...(face.gallery ?? []), item] });
      toast.success("A moving picture is bound.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not animate this face");
    } finally {
      setBusyShot(null);
    }
  }

  function addUpload(kind: GalleryItem["kind"], url: string) {
    updateCharacter(characterId, {
      gallery: [...gallery, { ...makeVersion(url, "upload"), kind }],
    });
  }

  function dropGallery(id: string) {
    updateCharacter(characterId, { gallery: gallery.filter((g) => g.id !== id) });
  }

  return (
    <div className="grid gap-6">
      <label className="grid gap-2 text-sm">
        <span className="text-muted">Name</span>
        <Input value={face.name} onChange={(e) => updateCharacter(characterId, { name: e.target.value })} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="text-muted">Race</span>
          <Input value={face.race} onChange={(e) => updateCharacter(characterId, { race: e.target.value })} />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-muted">Class or role</span>
          <Input
            value={face.classOrRole}
            onChange={(e) => updateCharacter(characterId, { classOrRole: e.target.value })}
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="text-muted">At the table</span>
          <select
            value={face.kind}
            onChange={(e) => updateCharacter(characterId, { kind: e.target.value as CharacterKind })}
            className="flex h-11 w-full rounded-lg bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="pc">Player character</option>
            <option value="npc">NPC</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-muted">Status</span>
          <select
            value={face.status}
            onChange={(e) => updateCharacter(characterId, { status: e.target.value as CharacterStatus })}
            className="flex h-11 w-full rounded-lg bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm">
        <span className="text-muted">Notes</span>
        <Textarea
          value={face.notes}
          onChange={(e) => updateCharacter(characterId, { notes: e.target.value })}
          className="min-h-28"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted">Locked appearance</span>
        <Textarea
          value={face.appearance}
          onChange={(e) => updateCharacter(characterId, { appearance: e.target.value })}
        />
        <span className="text-xs text-subtle">
          Later nights and new paintings use this, and the current portrait as the face.
        </span>
      </label>

      <section className="grid gap-4">
        <h2 className="font-display text-xl">More pictures</h2>
        {gallery.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {gallery.map((item) => (
              <GalleryCraft
                key={item.id}
                item={item}
                appearance={face.appearance}
                name={face.name}
                portraitUrl={face.portraitUrl}
                onAdd={(next) =>
                  updateCharacter(characterId, { gallery: [...gallery, next] })
                }
                onRemove={() => dropGallery(item.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No extra pictures yet.</p>
        )}
        <Textarea
          value={shotPrompt}
          onChange={(e) => setShotPrompt(e.target.value)}
          placeholder="Optional direction: in a tavern, wounded, at rest…"
          className="min-h-24"
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={addGeneratedShot} disabled={Boolean(busyShot)}>
            {busyShot === "image" ? "Painting…" : "Generate a picture"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addGeneratedVideo}
            disabled={Boolean(busyShot)}
          >
            {busyShot === "video" ? "Animating…" : "Generate a video"}
          </Button>
          <AddMediaButton kind="image" label="Upload a picture" onAdd={(url) => addUpload("image", url)} />
          <AddMediaButton kind="video" label="Upload a video" onAdd={(url) => addUpload("video", url)} />
        </div>
      </section>

      {confirm ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted">Remove this face from the tome?</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              removeCharacter(characterId);
              navigate({ to: "/tome/$campaignId/party", params: { campaignId } });
            }}
          >
            Remove them
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setConfirm(false)}>
            Keep them
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
          Remove this face
        </Button>
      )}
    </div>
  );
}

function GalleryCraft({
  item,
  appearance,
  name,
  portraitUrl,
  onAdd,
  onRemove,
}: {
  item: GalleryItem;
  appearance: string;
  name: string;
  portraitUrl: string;
  onAdd: (item: GalleryItem) => void;
  onRemove: () => void;
}) {
  const [instruction, setInstruction] = useState("");
  const [busy, setBusy] = useState<"ai" | "animate" | null>(null);

  async function regenerate() {
    setBusy("ai");
    try {
      if (item.kind === "image") {
        const made = await makePortrait({
          data: {
            appearance: withDirection(appearance, instruction),
            ref: item.url,
          },
        });
        if (!made.ok) throw new Error(made.error);
        onAdd({ ...makeVersion(made.url, "ai"), kind: "image" });
        toast.success("A new picture is bound. The last one is still here.");
      } else {
        if (!portraitUrl) throw new Error("Need a still to regenerate from.");
        const url = await animateStill(
          portraitUrl,
          `${name}, ${appearance}`,
          instruction.trim() || undefined,
        );
        onAdd({ ...makeVersion(url, "ai"), kind: "video" });
        toast.success("A new video is bound. The last one is still here.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not regenerate this");
    } finally {
      setBusy(null);
    }
  }

  async function animate() {
    setBusy("animate");
    try {
      const url = await animateStill(
        item.url,
        `${name}, ${appearance}`,
        instruction.trim() || undefined,
      );
      onAdd({ ...makeVersion(url, "ai"), kind: "video" });
      toast.success("The picture is moving.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not animate this");
    } finally {
      setBusy(null);
    }
  }

  return (
    <figure className="grid gap-2">
      <div className="aspect-video overflow-hidden rounded-lg bg-elevated">
        {item.kind === "video" ? (
          <video src={item.url} controls playsInline className="h-full w-full object-cover" />
        ) : (
          <img src={item.url} alt="" className="h-full w-full object-cover object-top" />
        )}
      </div>
      <Textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        placeholder="Direction: wounded, at rest, more torchlight…"
        className="min-h-16"
      />
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={regenerate} disabled={Boolean(busy)}>
          {busy === "ai" ? "Working…" : "Regenerate with direction"}
        </Button>
        {item.kind === "image" ? (
          <Button type="button" size="sm" variant="outline" onClick={animate} disabled={Boolean(busy)}>
            {busy === "animate" ? "Animating…" : "Animate this picture"}
          </Button>
        ) : null}
        <Button type="button" size="sm" variant="ghost" onClick={onRemove}>
          Remove
        </Button>
      </div>
    </figure>
  );
}
