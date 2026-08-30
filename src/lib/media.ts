import { nid } from "./ids";
import { MAX_GALLERY_VIDEO_BYTES } from "./limits";
import type { MediaSource, MediaVersion } from "./types";

export function nowIso() {
  return new Date().toISOString();
}

export function versionsFor(
  current: string | undefined,
  history: MediaVersion[] | undefined,
): MediaVersion[] {
  const hist = history ?? [];
  if (!current) return hist;
  if (hist.some((h) => h.url === current)) return hist;
  return [
    {
      id: nid("media"),
      url: current,
      createdAt: "",
      source: "seed",
    },
    ...hist,
  ];
}

export function makeVersion(url: string, source: MediaSource): MediaVersion {
  return { id: nid("media"), url, createdAt: nowIso(), source };
}

export function withNewVersion(
  current: string | undefined,
  history: MediaVersion[] | undefined,
  nextUrl: string,
  source: MediaSource,
): { url: string; history: MediaVersion[] } {
  const base = versionsFor(current, history);
  const version = makeVersion(nextUrl, source);
  const historyNext = [...base.filter((h) => h.url !== nextUrl), version];
  return { url: nextUrl, history: historyNext };
}

export function previousVersion(
  current: string | undefined,
  history: MediaVersion[] | undefined,
): MediaVersion | null {
  const versions = versionsFor(current, history);
  if (versions.length < 2) return null;
  const index = versions.findIndex((v) => v.url === current);
  if (index > 0) return versions[index - 1] ?? null;
  return versions[versions.length - 2] ?? null;
}

export function dropVersion(
  current: string | undefined,
  history: MediaVersion[] | undefined,
  url: string,
): { url: string; history: MediaVersion[] } {
  const historyNext = versionsFor(current, history).filter((h) => h.url !== url);
  const nextCurrent = current === url ? (historyNext.at(-1)?.url ?? "") : (current ?? "");
  return { url: nextCurrent, history: historyNext };
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.readAsDataURL(blob);
  });
}

export async function fileToStoredUrl(file: File): Promise<string> {
  if (file.type.startsWith("video/")) {
    if (file.size > MAX_GALLERY_VIDEO_BYTES) {
      throw new Error("That video is too large to keep in the tome. Try a shorter clip (about 10 MB).");
    }
    return blobToDataUrl(file);
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose a picture or a video.");
  }
  return resizeImageFile(file, 1400, 0.86);
}

function resizeImageFile(file: File, maxEdge: number, quality: number) {
  return new Promise<string>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not prepare the picture"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that picture"));
    };
    img.src = url;
  });
}
