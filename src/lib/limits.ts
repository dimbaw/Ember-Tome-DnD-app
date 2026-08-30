/** In-app capture. 24 kbps opus → ~11 MB per hour, ~43 MB at four hours. */
export const MAX_RECORD_MS = 4 * 60 * 60 * 1000;

/** Session audio upload / transcribe. Under the 500 MB STT API ceiling. */
export const MAX_AUDIO_BYTES = 200 * 1024 * 1024;

/** PDFs and other documents (xAI Files API is 48 MB). */
export const MAX_DOC_BYTES = 48 * 1024 * 1024;

/** Photos of notes, maps, character sheets. */
export const MAX_IMAGE_SOURCE_BYTES = 12 * 1024 * 1024;

export const MAX_SOURCE_FILES = 8;

export const MAX_GALLERY_VIDEO_BYTES = 10 * 1024 * 1024;

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
}

export function formatDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
