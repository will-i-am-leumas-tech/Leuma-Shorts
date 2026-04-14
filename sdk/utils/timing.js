export function normalizeWhitespace(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text) {
  const normalized = normalizeWhitespace(text);
  if (!normalized) {
    return 0;
  }

  return normalized.split(" ").length;
}

export function estimateSpeechDurationSeconds(
  text,
  { wordsPerMinute = 155, speed = 1 } = {},
) {
  const words = Math.max(countWords(text), 1);
  return Number(((words / wordsPerMinute) * 60 / Math.max(speed, 0.1)).toFixed(3));
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function formatSrtTimestamp(seconds) {
  const totalMs = Math.max(0, Math.round(seconds * 1000));
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const secs = Math.floor((totalMs % 60_000) / 1000);
  const ms = totalMs % 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

export function formatAssTimestamp(seconds) {
  const totalCentiseconds = Math.max(0, Math.round(seconds * 100));
  const hours = Math.floor(totalCentiseconds / 360_000);
  const minutes = Math.floor((totalCentiseconds % 360_000) / 6000);
  const secs = Math.floor((totalCentiseconds % 6000) / 100);
  const centiseconds = totalCentiseconds % 100;
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}
