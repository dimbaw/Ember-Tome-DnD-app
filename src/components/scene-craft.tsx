import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaEditor } from "@/components/media-editor";
import { makeScene } from "@/lib/ai/fns";
import { animateStill } from "@/lib/craft";
import { withDirection } from "@/lib/art";
import { nid } from "@/lib/ids";
import { makeVersion, withNewVersion } from "@/lib/media";
import { useTome } from "@/lib/store";
import type { Scene, SceneKind } from "@/lib/types";

const KINDS: SceneKind[] = ["moment", "encounter", "travel", "roleplay"];

export function SceneCraft({ scene }: { scene: Scene }) {
  const updateScene = useTome((s) => s.updateScene);
  const removeScene = useTome((s) => s.removeScene);
  const allCharacters = useTome((s) => s.characters);
  const characters = allCharacters.filter((c) => c.campaignId === scene.campaignId);
  const [confirm, setConfirm] = useState(false);

  const involved = characters.filter((c) => scene.characterIds.includes(c.id));

  async function generateStill(instruction?: string) {
    const appearances = involved.map((c) => `${c.name}: ${c.appearance}`);
    const refs = involved.filter((c) => c.portraitUrl).slice(0, 3).map((c) => c.portraitUrl);
    const made = await makeScene({
      data: { beat: withDirection(scene.beat || scene.title, instruction), appearances, refs },
    });
    if (!made.ok) throw new Error(made.error);
    return made.url;
  }

  return (
    <div className="grid gap-6 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="text-muted">Title</span>
          <Input
            value={scene.title}
            onChange={(e) => updateScene(scene.id, { title: e.target.value })}
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-muted">Kind</span>
          <select
            value={scene.kind}
            onChange={(e) => updateScene(scene.id, { kind: e.target.value as SceneKind })}
            className="flex h-11 w-full rounded-lg bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm">
        <span className="text-muted">What the picture should show</span>
        <Textarea
          value={scene.beat}
          onChange={(e) => updateScene(scene.id, { beat: e.target.value })}
          className="min-h-28"
        />
      </label>
      <fieldset className="grid gap-2">
        <legend className="text-sm text-muted">Faces in this picture</legend>
        <div className="flex flex-wrap gap-2">
          {characters.map((c) => {
            const on = scene.characterIds.includes(c.id);
            return (
              <label
                key={c.id}
                className="flex h-11 items-center gap-2 rounded-lg bg-elevated px-3 text-sm"
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => {
                    const characterIds = on
                      ? scene.characterIds.filter((id) => id !== c.id)
                      : [...scene.characterIds, c.id];
                    updateScene(scene.id, { characterIds });
                  }}
                />
                {c.name}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs tracking-[0.16em] text-subtle uppercase">Still</p>
          <MediaEditor
            kind="image"
            url={scene.imageUrl}
            history={scene.imageHistory}
            aspect="video"
            alt={scene.title}
            generateLabel="Generate a new still"
            emptyLabel="No still yet."
            onChange={(imageUrl, imageHistory) => updateScene(scene.id, { imageUrl, imageHistory })}
            onGenerate={generateStill}
            onAnimate={async (instruction) => {
              const next = await animateStill(scene.imageUrl, scene.beat || scene.title, instruction);
              const result = withNewVersion(scene.videoUrl ?? "", scene.videoHistory, next, "ai");
              updateScene(scene.id, { videoUrl: result.url, videoHistory: result.history });
            }}
          />
        </div>
        <div>
          <p className="mb-3 text-xs tracking-[0.16em] text-subtle uppercase">Moving picture</p>
          <MediaEditor
            kind="video"
            url={scene.videoUrl ?? ""}
            history={scene.videoHistory}
            aspect="video"
            alt={scene.title}
            generateLabel="Generate a new video"
            emptyLabel="No animation yet. Generate from the still."
            onChange={(videoUrl, videoHistory) =>
              updateScene(scene.id, { videoUrl: videoUrl || undefined, videoHistory })
            }
            onGenerate={async (instruction) => {
              if (!scene.imageUrl) throw new Error("Paint the still first.");
              return animateStill(scene.imageUrl, scene.beat || scene.title, instruction);
            }}
          />
        </div>
      </div>

      {confirm ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted">Remove this moment from the night?</p>
          <Button size="sm" variant="outline" onClick={() => removeScene(scene.id)}>
            Remove it
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setConfirm(false)}>
            Keep it
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="ghost" className="justify-self-start" onClick={() => setConfirm(true)}>
          Remove this moment
        </Button>
      )}
    </div>
  );
}

export function AddSceneForm({
  campaignId,
  sessionId,
}: {
  campaignId: string;
  sessionId: string;
}) {
  const addScenes = useTome((s) => s.addScenes);
  const allCharacters = useTome((s) => s.characters);
  const characters = allCharacters.filter((c) => c.campaignId === campaignId);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [beat, setBeat] = useState("");
  const [kind, setKind] = useState<SceneKind>("moment");
  const [ids, setIds] = useState<string[]>([]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !beat.trim()) {
      toast.error("Give the moment a title and describe what to paint.");
      return;
    }
    setBusy(true);
    try {
      const involved = characters.filter((c) => ids.includes(c.id));
      const appearances = involved.map((c) => `${c.name}: ${c.appearance}`);
      const refs = involved.filter((c) => c.portraitUrl).slice(0, 3).map((c) => c.portraitUrl);
      const made = await makeScene({ data: { beat: beat.trim(), appearances, refs } });
      if (!made.ok) throw new Error(made.error);
      addScenes([
        {
          id: nid("scene"),
          campaignId,
          sessionId,
          title: title.trim(),
          beat: beat.trim(),
          kind,
          imageUrl: made.url,
          imageHistory: [makeVersion(made.url, "ai")],
          videoHistory: [],
          characterIds: ids,
        },
      ]);
      setTitle("");
      setBeat("");
      setIds([]);
      setOpen(false);
      toast.success("The moment is bound.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not paint this moment");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        Add a moment
      </Button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <h3 className="font-display text-xl">New moment</h3>
      <label className="grid gap-2 text-sm">
        <span className="text-muted">Title</span>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted">Kind</span>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as SceneKind)}
          className="flex h-11 w-full rounded-lg bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {KINDS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted">What to paint</span>
        <Textarea value={beat} onChange={(e) => setBeat(e.target.value)} className="min-h-28" required />
      </label>
      <fieldset className="grid gap-2">
        <legend className="text-sm text-muted">Who is in it</legend>
        <div className="flex flex-wrap gap-2">
          {characters.map((c) => {
            const on = ids.includes(c.id);
            return (
              <label key={c.id} className="flex h-11 items-center gap-2 rounded-lg bg-elevated px-3 text-sm">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => setIds(on ? ids.filter((id) => id !== c.id) : [...ids, c.id])}
                />
                {c.name}
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={busy}>
          {busy ? "Painting…" : "Paint this moment"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
