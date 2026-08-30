import { useState } from "react";
import { toast } from "sonner";
import { Film, Play, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RestorePreviousButton, VersionStrip } from "@/components/media-editor";
import { makeScene } from "@/lib/ai/fns";
import { animateStill } from "@/lib/craft";
import { withDirection } from "@/lib/art";
import { dropVersion, withNewVersion } from "@/lib/media";
import { useTome } from "@/lib/store";
import type { Scene } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SceneFrame({
  scene,
  className,
  eager,
}: {
  scene: Scene;
  className?: string;
  eager?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [busy, setBusy] = useState<"still" | "animate" | "video" | null>(null);
  const updateScene = useTome((s) => s.updateScene);
  const allCharacters = useTome((s) => s.characters);
  const live = useTome((s) => s.scenes.find((x) => x.id === scene.id)) ?? scene;
  const involved = allCharacters.filter((c) => live.characterIds.includes(c.id));
  const hasVideo = Boolean(live.videoUrl);

  async function generateStill() {
    setBusy("still");
    try {
      const appearances = involved.map((c) => `${c.name}: ${c.appearance}`);
      const refs = involved.filter((c) => c.portraitUrl).slice(0, 3).map((c) => c.portraitUrl);
      const made = await makeScene({
        data: {
          beat: withDirection(live.beat || live.title, instruction),
          appearances,
          refs,
        },
      });
      if (!made.ok) throw new Error(made.error);
      const result = withNewVersion(live.imageUrl, live.imageHistory, made.url, "ai");
      updateScene(live.id, { imageUrl: result.url, imageHistory: result.history });
      toast.success("A new painting is bound. Use the previous picture if you want the last one.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not paint this");
    } finally {
      setBusy(null);
    }
  }

  async function animate() {
    if (!live.imageUrl) return;
    setBusy("animate");
    try {
      const next = await animateStill(live.imageUrl, live.beat || live.title, instruction);
      const result = withNewVersion(live.videoUrl ?? "", live.videoHistory, next, "ai");
      updateScene(live.id, { videoUrl: result.url, videoHistory: result.history });
      toast.success("The picture is moving.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not animate this");
    } finally {
      setBusy(null);
    }
  }

  async function regenVideo() {
    if (!live.imageUrl) return;
    setBusy("video");
    try {
      const next = await animateStill(live.imageUrl, live.beat || live.title, instruction);
      const result = withNewVersion(live.videoUrl ?? "", live.videoHistory, next, "ai");
      updateScene(live.id, { videoUrl: result.url, videoHistory: result.history });
      toast.success("A new video is bound. Use the previous video if you want the last one.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not regenerate this");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group relative block w-full overflow-hidden rounded-xl text-left",
          className,
        )}
      >
        <img
          src={live.imageUrl}
          alt={live.title}
          loading={eager ? "eager" : "lazy"}
          className="aspect-video w-full object-cover transition-transform duration-500 ease-[var(--ease-out-smooth)] group-hover:scale-[1.02]"
        />
        {hasVideo ? (
          <span className="absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full bg-bg/70 text-fg">
            <Play className="size-4 translate-x-px" />
          </span>
        ) : null}
      </button>
      <SceneVersions sceneId={live.id} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle className="sr-only">{live.title}</DialogTitle>
          {hasVideo ? (
            <video
              src={live.videoUrl}
              poster={live.imageUrl}
              controls
              autoPlay
              playsInline
              className="aspect-video w-full rounded-lg object-cover"
            />
          ) : (
            <img
              src={live.imageUrl}
              alt={live.title}
              className="aspect-video w-full rounded-lg object-cover"
            />
          )}
          <div className="grid gap-3 px-3 pt-2 pb-3">
            <p className="font-display text-lg text-fg">{live.title}</p>
            <p className="text-sm leading-relaxed text-muted">{live.beat}</p>
            <Textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Direction: closer, more blood, rain, slower camera…"
              className="min-h-20"
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={generateStill} disabled={Boolean(busy)}>
                <Sparkles className="size-4" />
                {busy === "still" ? "Painting…" : "Regenerate still"}
              </Button>
              <Button type="button" variant="outline" onClick={animate} disabled={Boolean(busy)}>
                <Film className="size-4" />
                {busy === "animate" ? "Animating…" : "Animate this picture"}
              </Button>
              {hasVideo ? (
                <Button type="button" variant="outline" onClick={regenVideo} disabled={Boolean(busy)}>
                  {busy === "video" ? "Working…" : "Regenerate video"}
                </Button>
              ) : null}
            </div>
            <SceneVersions sceneId={live.id} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SceneVersions({ sceneId }: { sceneId: string }) {
  const live = useTome((s) => s.scenes.find((x) => x.id === sceneId));
  const updateScene = useTome((s) => s.updateScene);
  if (!live) return null;

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <RestorePreviousButton
          url={live.imageUrl}
          history={live.imageHistory}
          onSelect={(imageUrl, imageHistory) => updateScene(live.id, { imageUrl, imageHistory })}
        />
        <RestorePreviousButton
          url={live.videoUrl ?? ""}
          history={live.videoHistory}
          label="Use the previous video"
          onSelect={(videoUrl, videoHistory) =>
            updateScene(live.id, { videoUrl: videoUrl || undefined, videoHistory })
          }
        />
      </div>
      <VersionStrip
        kind="image"
        url={live.imageUrl}
        history={live.imageHistory}
        onSelect={(imageUrl, imageHistory) => updateScene(live.id, { imageUrl, imageHistory })}
        onRemove={(target) => {
          const result = dropVersion(live.imageUrl, live.imageHistory, target);
          updateScene(live.id, { imageUrl: result.url, imageHistory: result.history });
        }}
      />
      <VersionStrip
        kind="video"
        url={live.videoUrl ?? ""}
        history={live.videoHistory}
        onSelect={(videoUrl, videoHistory) =>
          updateScene(live.id, { videoUrl: videoUrl || undefined, videoHistory })
        }
        onRemove={(target) => {
          const result = dropVersion(live.videoUrl ?? "", live.videoHistory, target);
          updateScene(live.id, {
            videoUrl: result.url || undefined,
            videoHistory: result.history,
          });
        }}
      />
    </div>
  );
}
