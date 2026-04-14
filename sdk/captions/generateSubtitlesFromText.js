import { chunkTranscript } from "./chunkTranscript.js";
import {
  countWords,
  formatSrtTimestamp,
} from "../utils/timing.js";

export function generateSubtitlesFromText(
  text,
  duration,
  {
    maxWordsPerChunk = 8,
    maxCharsPerChunk = 52,
    chunks,
  } = {},
) {
  const subtitleChunks =
    chunks ||
    chunkTranscript(text, {
      maxWords: maxWordsPerChunk,
      maxChars: maxCharsPerChunk,
    });

  if (subtitleChunks.length === 0) {
    return [];
  }

  const totalWeight =
    subtitleChunks.reduce((sum, chunk) => sum + Math.max(countWords(chunk), 1), 0) || 1;

  let currentTime = 0;
  return subtitleChunks.map((chunk, index) => {
    const weight = Math.max(countWords(chunk), 1);
    const remaining = duration - currentTime;
    const rawDuration = (weight / totalWeight) * duration;
    const chunkDuration = index === subtitleChunks.length - 1 ? remaining : rawDuration;
    const start = currentTime;
    const end = index === subtitleChunks.length - 1 ? duration : currentTime + chunkDuration;
    currentTime = end;

    return {
      index: index + 1,
      start,
      end,
      text: chunk,
    };
  });
}

export function renderSrtFromSubtitles(subtitles) {
  return subtitles
    .map(
      (subtitle) =>
        `${subtitle.index}\n${formatSrtTimestamp(subtitle.start)} --> ${formatSrtTimestamp(subtitle.end)}\n${subtitle.text}\n`,
    )
    .join("\n");
}
