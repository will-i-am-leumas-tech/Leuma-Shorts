import fs from "node:fs/promises";
import path from "node:path";
import { inspectMedia } from "../sdk/media/inspectMedia.js";
import { validateEnvironment } from "../sdk/validateEnvironment.js";

async function main() {
  const target = process.argv[2];
  if (!target) {
    throw new Error("Usage: node scripts/validate-output.js ./output/story-001/final.mp4");
  }

  await validateEnvironment({
    requireFfmpeg: false,
    requireFfprobe: true,
  });

  const absoluteTarget = path.resolve(process.cwd(), target);
  const stats = await fs.stat(absoluteTarget);
  const media = await inspectMedia(absoluteTarget);

  const result = {
    file: absoluteTarget,
    sizeBytes: stats.size,
    duration: media.duration,
    width: media.width,
    height: media.height,
    hasAudio: media.hasAudio,
    hasVideo: media.hasVideo,
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
