import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FileText, Mic, Square, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { extractSourceFile, ingestSession, type IngestStep } from "@/lib/ingest";
import {
  formatBytes,
  formatDuration,
  MAX_RECORD_MS,
  MAX_SOURCE_FILES,
} from "@/lib/limits";
import { SAMPLE_TRANSCRIPT } from "@/lib/seed";
import { assertSourceSize, kindLabel, sourceKind } from "@/lib/sources";
import { useTome } from "@/lib/store";

export const Route = createFileRoute("/tome/$campaignId/record")({
  component: RecordPage,
});

const MAX_MS = MAX_RECORD_MS;
const STEP_COPY: Record<IngestStep, string> = {
  listening: "Listening to the table…",
  gathering: "Reading the pages, maps, and notes…",
  reading: "Reading who was there, and what turned…",
  portraits: "Keeping the faces straight…",
  illustrating: "Painting the night…",
  mapping: "Imagining the places the DM described…",
  binding: "Binding it into the tome…",
};

const ACCEPT = [
  "audio/*",
  "image/*",
  ".webm",
  ".mp3",
  ".wav",
  ".m4a",
  ".ogg",
  ".pdf",
  ".txt",
  ".md",
  ".csv",
  ".json",
  ".doc",
  ".docx",
  ".rtf",
  ".html",
].join(",");

function RecordPage() {
  const { campaignId } = Route.useParams();
  const navigate = useNavigate();
  const allCharacters = useTome((s) => s.characters);
  const allLocations = useTome((s) => s.locations);
  const characters = allCharacters.filter((c) => c.campaignId === campaignId);
  const locations = allLocations.filter((l) => l.campaignId === campaignId);
  const [tab, setTab] = useState<"record" | "upload" | "notes">("record");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<IngestStep | null>(null);
  const [detail, setDetail] = useState("");
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  function startTimer() {
    const started = Date.now();
    timerRef.current = window.setInterval(() => {
      const ms = Date.now() - started;
      setElapsed(ms);
      if (ms >= MAX_MS) stopRecording();
    }, 200);
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, {
        mimeType: mime,
        audioBitsPerSecond: 24000,
      });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const file = new Blob(chunksRef.current, { type: recorder.mimeType });
        setBlob(file);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRef.current = recorder;
      recorder.start();
      setRecording(true);
      setElapsed(0);
      setBlob(null);
      startTimer();
    } catch {
      toast.error("Microphone access was blocked. Upload a file or paste notes instead.");
      setTab("notes");
    }
  }

  function stopRecording() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    mediaRef.current?.stop();
    setRecording(false);
  }

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const incoming = Array.from(list);
    try {
      incoming.forEach(assertSourceSize);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "That file is too large");
      return;
    }
    setFiles((current) => {
      const next = [...current, ...incoming];
      if (next.length > MAX_SOURCE_FILES) {
        toast.error(`The tome takes up to ${MAX_SOURCE_FILES} files at a time.`);
        return next.slice(0, MAX_SOURCE_FILES);
      }
      return next;
    });
  }

  async function chronicle(input: { notes?: string; files?: File[] }) {
    setBusy(true);
    try {
      const keyterms = [...characters.map((c) => c.name), ...locations.map((l) => l.name)];
      const parts: string[] = [];
      const extraNotes = input.notes?.trim() ?? "";
      if (extraNotes) parts.push(extraNotes);

      for (const file of input.files ?? []) {
        assertSourceSize(file);
        const kind = sourceKind(file);
        setStep(kind === "audio" ? "listening" : "gathering");
        setDetail(file.name);
        const text = await extractSourceFile(file, keyterms);
        parts.push(`--- From ${file.name} ---\n${text}`);
      }

      const transcript = parts.join("\n\n").trim();
      if (!transcript) throw new Error("Nothing to chronicle yet.");

      const result = await ingestSession({
        campaignId,
        transcript,
        onStep: (s, d) => {
          setStep(s);
          setDetail(d ?? "");
        },
      });
      navigate({
        to: "/tome/$campaignId/session/$sessionId",
        params: { campaignId: result.campaignId, sessionId: result.sessionId },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not bind this session");
      setBusy(false);
      setStep(null);
    }
  }

  const clock = formatDuration(elapsed);

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-xs tracking-[0.22em] text-muted uppercase">The table is listening</p>
      <h1 className="mt-2 font-display text-4xl">Record a session</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Bring the night however it exists: a recording, a PDF, a map photo, a character sheet, pasted notes.
        The chronicler reads it and binds what it finds — faces, places, and what turned.
      </p>

      <div className="mt-8 flex rounded-xl bg-surface p-1 shadow-[var(--shadow-border)]">
        {(
          [
            ["record", "Record"],
            ["upload", "Upload"],
            ["notes", "Notes"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`h-11 flex-1 rounded-lg text-sm ${tab === id ? "bg-elevated text-fg" : "text-muted"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {busy && step ? (
        <div className="mt-10 rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
          <p className="font-display text-2xl">{STEP_COPY[step]}</p>
          {detail ? <p className="mt-2 text-sm text-muted">{detail}</p> : null}
          <p className="mt-4 text-xs text-subtle">
            This takes a little while. Portraits are painted once; scenes reuse them.
          </p>
        </div>
      ) : (
        <>
          {tab === "record" ? (
            <div className="mt-10 flex flex-col items-center rounded-xl bg-surface px-6 py-12 shadow-[var(--shadow-border)]">
              <button
                type="button"
                onClick={recording ? stopRecording : startRecording}
                className="flex size-24 items-center justify-center rounded-full bg-primary text-primary-fg"
                aria-label={recording ? "Stop recording" : "Start recording"}
              >
                {recording ? <Square className="size-7" /> : <Mic className="size-8" />}
              </button>
              <p className="mt-5 font-display text-3xl tabular-nums">{clock}</p>
              <p className="mt-2 text-xs text-subtle">Up to four hours. Speak the names clearly.</p>
              {blob && !recording ? (
                <Button
                  className="mt-6"
                  onClick={() =>
                    chronicle({
                      files: [new File([blob], "session.webm", { type: blob.type || "audio/webm" })],
                    })
                  }
                >
                  Chronicle this recording
                </Button>
              ) : null}
            </div>
          ) : null}

          {tab === "upload" ? (
            <div className="mt-10 grid gap-4">
              <label className="flex cursor-pointer flex-col items-center rounded-xl bg-surface px-6 py-12 shadow-[var(--shadow-border)]">
                <Upload className="size-8 text-muted" />
                <p className="mt-3 text-sm text-muted">Drop files, or choose them.</p>
                <p className="mt-1 max-w-sm text-center text-xs text-subtle">
                  Audio, PDF, pictures of maps and sheets, text — up to {MAX_SOURCE_FILES} files.
                </p>
                <input
                  type="file"
                  multiple
                  accept={ACCEPT}
                  className="sr-only"
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
              {files.length > 0 ? (
                <ul className="grid gap-2">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center gap-3 rounded-lg bg-elevated px-3 py-2"
                    >
                      <FileText className="size-4 shrink-0 text-muted" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{file.name}</p>
                        <p className="text-xs text-subtle">
                          {kindLabel(sourceKind(file))} · {formatBytes(file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="flex size-11 items-center justify-center text-muted hover:text-fg"
                        aria-label={`Remove ${file.name}`}
                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes to read with the files."
                className="min-h-28"
              />
              <Button
                onClick={() => chronicle({ notes, files })}
                disabled={files.length === 0 && !notes.trim()}
              >
                Chronicle what you brought
              </Button>
            </div>
          ) : null}

          {tab === "notes" ? (
            <div className="mt-10 grid gap-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Who was there. What happened. The fight, the choice, the name they learned."
                className="min-h-56"
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button onClick={() => chronicle({ notes })} disabled={!notes.trim()}>
                  Chronicle these notes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setNotes(SAMPLE_TRANSCRIPT)}
                  type="button"
                >
                  Load a sample table
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
