import { normalizeWhitespace } from "../utils/timing.js";

function splitLongSentence(sentence, maxWords, maxChars) {
  const words = sentence.split(" ");
  const chunks = [];
  let current = [];

  for (const word of words) {
    const candidate = [...current, word].join(" ");
    if (
      current.length > 0 &&
      (candidate.length > maxChars || current.length >= maxWords)
    ) {
      chunks.push(current.join(" "));
      current = [word];
    } else {
      current.push(word);
    }
  }

  if (current.length > 0) {
    chunks.push(current.join(" "));
  }

  return chunks;
}

export function chunkTranscript(
  text,
  { maxWords = 8, maxChars = 52 } = {},
) {
  const normalized = normalizeWhitespace(text);
  if (!normalized) {
    return [];
  }

  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .flatMap((sentence) => splitLongSentence(sentence.trim(), maxWords, maxChars))
    .filter(Boolean);

  if (sentences.length > 0) {
    return sentences;
  }

  return splitLongSentence(normalized, maxWords, maxChars).filter(Boolean);
}
