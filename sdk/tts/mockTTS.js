import { runFfmpeg } from "../ffmpeg/runFfmpeg.js";
import { normalizeMediaToolPath } from "../ffmpeg/runtime.js";
import { estimateSpeechDurationSeconds } from "../utils/timing.js";

export async function mockTTS({
  text,
  outputPath,
  voice = {},
}) {
  const duration = estimateSpeechDurationSeconds(text, {
    wordsPerMinute: voice.wordsPerMinute || 155,
    speed: voice.speed || 1,
  });

  await runFfmpeg([
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-f",
    "lavfi",
    "-i",
    `sine=frequency=${voice.frequency || 210}:sample_rate=44100:duration=${duration}`,
    "-filter:a",
    "volume=0.14",
    "-c:a",
    "pcm_s16le",
    normalizeMediaToolPath(outputPath),
  ]);

  return {
    provider: "mock",
    audioPath: outputPath,
    duration,
  };
}
