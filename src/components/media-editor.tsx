import { useRef, useState } from "react";
import { toast } from "sonner";
import { Film, ImagePlus, Sparkles, Trash2, Undo2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { dropVersion, fileToStoredUrl, previousVersion, versionsFor, withNewVersion } from "@/lib/media";
import type { MediaKind, MediaVersion } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MediaEditor({
  kind,
  url,
  history,
  aspect,
  alt,
  generateLabel,
  uploadLabel = "Upload",
  emptyLabel,
  onChange,
  onGenerate,
  onAnimate,
}: {
  kind: MediaKind;
  url: string;
  history?: MediaVersion[];
  aspect: "portrait" | "video";
  alt: string;
  generateLabel: string;
  uploadLabel?: string;
  emptyLabel: string;
  onChange: (url: string, history: MediaVersion[]) => void;
  onGenerate: (instruction?: string) => Promise<string>;
  onAnimate?: (instruction?: string) => Promise<void>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"ai" | "upload" | "animate" | null>(null);
  const [instruction, setInstruction] = useState("");
  const versions = versionsFor(url, history);
  const direction = instruction.trim() || undefined;

  async function generate() {
    setBusy("ai");
    try {
      const next = await onGenerate(direction);
      const result = withNewVersion(url, history, next, "ai");
      onChange(result.url, result.history);
      toast.success(kind === "video" ? "The moment is moving." : "A new painting is bound.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate this");
    } finally {
      setBusy(null);
    }
  }

  async function animate() {
    if (!onAnimate) return;
    if (!url) {
      toast.error("Paint the still first.");
      return;
    }
    setBusy("animate");
    try {
      await onAnimate(direction);
      toast.success("The picture is moving.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not animate this");
    } finally {
      setBusy(null);
    }
  }

  async function onFile(file?: File) {
    if (!file) return;
    setBusy("upload");
    try {
      const next = await fileToStoredUrl(file);
      const result = withNewVersion(url, history, next, "upload");
      onChange(result.url, result.history);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add that file");
    } finally {
      setBusy(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function restore(nextUrl: string) {
    onChange(nextUrl, versions);
  }

  function remove(target: string) {
    const result = dropVersion(url, history, target);
    onChange(result.url, result.history);
  }

  return (
    <div className="grid gap-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-elevated",
          aspect === "portrait" ? "aspect-portrait" : "aspect-video",
        )}
      >
        {url ? (
          kind === "video" ? (
            <video src={url} controls playsInline className="h-full w-full object-cover" />
          ) : (
            <img src={url} alt={alt} className="h-full w-full object-cover object-top" />
          )
        ) : (
          <p className="flex h-full items-center justify-center px-4 text-center text-sm text-muted">
            {emptyLabel}
          </p>
        )}
        {busy ? (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/70 text-sm text-fg">
            {busy === "animate"
              ? "Animating the picture…"
              : busy === "ai"
                ? "The chronicler is painting…"
                : "Binding the file…"}
          </div>
        ) : null}
      </div>

      <label className="grid gap-2 text-sm">
        <span className="text-muted">Direction (optional)</span>
        <Textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder={
            kind === "video"
              ? "e.g. slow push in, torch flicker, rain, blood on the blade…"
              : "e.g. closer on her face, more blood, dusk instead of noon, the inn fuller…"
          }
          className="min-h-20"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={generate} disabled={Boolean(busy)}>
          <Sparkles className="size-4" />
          {busy === "ai" ? "Working…" : generateLabel}
        </Button>
        {kind === "image" && onAnimate ? (
          <Button type="button" variant="outline" onClick={animate} disabled={Boolean(busy) || !url}>
            <Film className="size-4" />
            {busy === "animate" ? "Animating…" : "Animate this picture"}
          </Button>
        ) : null}
        <RestorePreviousButton
          url={url}
          history={history}
          disabled={Boolean(busy)}
          onSelect={restore}
          label={kind === "video" ? "Use the previous video" : "Use the previous picture"}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileRef.current?.click()}
          disabled={Boolean(busy)}
        >
          {kind === "video" ? <Film className="size-4" /> : <Upload className="size-4" />}
          {uploadLabel}
        </Button>
        {url ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => remove(url)}
            disabled={Boolean(busy)}
          >
            <Trash2 className="size-4" />
            Remove current
          </Button>
        ) : null}
        <span className="pointer-events-none absolute size-0 overflow-hidden opacity-0">
          <input
            ref={fileRef}
            type="file"
            accept={kind === "video" ? "video/*" : "image/*"}
            aria-hidden
            tabIndex={-1}
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </span>
      </div>

      {versions.length > 1 ? (
        <VersionStrip
          kind={kind}
          url={url}
          history={history}
          onSelect={restore}
          onRemove={remove}
        />
      ) : null}
    </div>
  );
}

export function AddMediaButton({
  kind,
  label,
  onAdd,
}: {
  kind: MediaKind;
  label: string;
  onAdd: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      onAdd(await fileToStoredUrl(file));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add that file");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => fileRef.current?.click()}
        disabled={busy}
      >
        <ImagePlus className="size-4" />
        {busy ? "Binding…" : label}
      </Button>
      <span className="pointer-events-none absolute size-0 overflow-hidden opacity-0">
        <input
          ref={fileRef}
          type="file"
          accept={kind === "video" ? "video/*" : "image/*"}
          aria-hidden
          tabIndex={-1}
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </span>
    </>
  );
}

export function RestorePreviousButton({
  url,
  history,
  onSelect,
  label = "Use the previous picture",
  disabled,
}: {
  url: string;
  history?: MediaVersion[];
  onSelect: (url: string, history: MediaVersion[]) => void;
  label?: string;
  disabled?: boolean;
}) {
  const versions = versionsFor(url, history);
  const prev = previousVersion(url, history);
  if (!prev) return null;
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      onClick={() => onSelect(prev.url, versions)}
    >
      <Undo2 className="size-4" />
      {label}
    </Button>
  );
}

export function VersionStrip({
  kind,
  url,
  history,
  onSelect,
  onRemove,
}: {
  kind: MediaKind;
  url: string;
  history?: MediaVersion[];
  onSelect: (url: string, history: MediaVersion[]) => void;
  onRemove?: (url: string) => void;
}) {
  const versions = versionsFor(url, history);
  if (versions.length < 2) return null;
  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-subtle uppercase">Previous — tap to restore</p>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {versions.map((version) => (
          <div key={version.id} className="relative shrink-0">
            <button
              type="button"
              onClick={() => onSelect(version.url, versions)}
              className={cn(
                "block size-16 overflow-hidden rounded-md",
                version.url === url
                  ? "ring-2 ring-ring"
                  : "ring-1 ring-border-strong opacity-80 hover:opacity-100",
              )}
            >
              {kind === "video" ? (
                <video src={version.url} muted playsInline className="h-full w-full object-cover" />
              ) : (
                <img src={version.url} alt="" className="h-full w-full object-cover object-top" />
              )}
            </button>
            {onRemove && version.url !== url ? (
              <button
                type="button"
                onClick={() => onRemove(version.url)}
                className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-bg text-muted hover:text-fg"
                aria-label="Remove this version"
              >
                <Trash2 className="size-3" />
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
