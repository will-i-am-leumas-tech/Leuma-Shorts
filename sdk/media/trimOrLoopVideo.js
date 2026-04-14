import { runFfmpeg } from "../ffmpeg/runFfmpeg.js";
import { normalizeMediaToolPath } from "../ffmpeg/runtime.js";

export async function trimOrLoopVideo({
  inputPath,
  outputPath,
  duration,
  width,
  height,
  fps = 30,
}) {
  const args = [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-stream_loop",
    "-1",
    "-i",
    normalizeMediaToolPath(inputPath),
    "-t",
    `${duration}`,
    "-vf",
    `scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},setsar=1`,
    "-r",
    `${fps}`,
    "-pix_fmt",
    "yuv420p",
    "-an",
    normalizeMediaToolPath(outputPath),
  ];

  await runFfmpeg(args);
  return outputPath;
}
