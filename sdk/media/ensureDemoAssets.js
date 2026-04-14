import path from "node:path";
import { runFfmpeg } from "../ffmpeg/runFfmpeg.js";
import { normalizeMediaToolPath } from "../ffmpeg/runtime.js";
import { validateEnvironment } from "../validateEnvironment.js";
import { ensureDir, fileExists } from "../utils/fs.js";

async function ensureSyntheticVideo({
  outputPath,
  filter,
  duration,
  width = 1280,
  height = 720,
  fps = 30,
}) {
  if (await fileExists(outputPath)) {
    return "existing";
  }

  await runFfmpeg([
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-f",
    "lavfi",
    "-i",
    filter,
    "-t",
    `${duration}`,
    "-s",
    `${width}x${height}`,
    "-r",
    `${fps}`,
    "-pix_fmt",
    "yuv420p",
    normalizeMediaToolPath(outputPath),
  ]);

  return "created";
}

async function ensureSyntheticImage({ outputPath, filter, width = 1080, height = 1080 }) {
  if (await fileExists(outputPath)) {
    return "existing";
  }

  await runFfmpeg([
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-f",
    "lavfi",
    "-i",
    filter,
    "-frames:v",
    "1",
    "-s",
    `${width}x${height}`,
    normalizeMediaToolPath(outputPath),
  ]);

  return "created";
}

export async function ensureDemoAssets({ projectRoot = process.cwd() } = {}) {
  await validateEnvironment({
    requireFfmpeg: true,
    requireFfprobe: false,
  });

  const gameplayDir = path.join(projectRoot, "assets", "gameplay");
  const realGameplayDir = path.join(gameplayDir, "real");
  const mediaDir = path.join(projectRoot, "assets", "media");
  const audioDir = path.join(projectRoot, "assets", "audio");
  const fontsDir = path.join(projectRoot, "assets", "fonts");

  await Promise.all([
    ensureDir(gameplayDir),
    ensureDir(realGameplayDir),
    ensureDir(mediaDir),
    ensureDir(audioDir),
    ensureDir(fontsDir),
  ]);

  const created = [];
  const existing = [];

  if (
    (await ensureSyntheticVideo({
      outputPath: path.join(gameplayDir, "placeholder-endless-runner.mp4"),
      filter: "testsrc2=size=1280x720:rate=30",
      duration: 20,
    })) === "created"
  ) {
    created.push("assets/gameplay/placeholder-endless-runner.mp4");
  } else {
    existing.push("assets/gameplay/placeholder-endless-runner.mp4");
  }

  if (
    (await ensureSyntheticVideo({
      outputPath: path.join(gameplayDir, "placeholder-block-parkour.mp4"),
      filter: "testsrc=size=1280x720:rate=30,eq=saturation=1.4",
      duration: 20,
    })) === "created"
  ) {
    created.push("assets/gameplay/placeholder-block-parkour.mp4");
  } else {
    existing.push("assets/gameplay/placeholder-block-parkour.mp4");
  }

  if (
    (await ensureSyntheticVideo({
      outputPath: path.join(gameplayDir, "placeholder-arcade-bars.mp4"),
      filter: "smptebars=size=1280x720:rate=30",
      duration: 20,
    })) === "created"
  ) {
    created.push("assets/gameplay/placeholder-arcade-bars.mp4");
  } else {
    existing.push("assets/gameplay/placeholder-arcade-bars.mp4");
  }

  if (
    (await ensureSyntheticVideo({
      outputPath: path.join(mediaDir, "sample-clip.mp4"),
      filter: "testsrc=size=1080x1080:rate=30,hue=s=0",
      duration: 10,
      width: 1080,
      height: 1080,
    })) === "created"
  ) {
    created.push("assets/media/sample-clip.mp4");
  } else {
    existing.push("assets/media/sample-clip.mp4");
  }

  if (
    (await ensureSyntheticImage({
      outputPath: path.join(mediaDir, "sample-image.jpg"),
      filter: "color=c=#f59e0b:size=1080x1080",
      width: 1080,
      height: 1080,
    })) === "created"
  ) {
    created.push("assets/media/sample-image.jpg");
  } else {
    existing.push("assets/media/sample-image.jpg");
  }

  return {
    created,
    existing,
    createdCount: created.length,
    existingCount: existing.length,
  };
}
