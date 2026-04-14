import fs from "node:fs/promises";
import path from "node:path";
import { ensureDemoAssets } from "../../sdk/media/ensureDemoAssets.js";
import { inspectMedia } from "../../sdk/media/inspectMedia.js";
import { validateEnvironment } from "../../sdk/validateEnvironment.js";

export const renderEnv = await validateEnvironment({
  requireFfmpeg: true,
  requireFfprobe: true,
  throwOnError: false,
});

export async function prepareRenderOutputDir(name) {
  const outputDir = path.resolve(process.cwd(), "output", "test-runs", name);
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
  return outputDir;
}

export async function ensureIntegrationAssets() {
  if (!renderEnv.ok) {
    return;
  }

  await ensureDemoAssets({
    projectRoot: process.cwd(),
  });
}

export async function inspectOutputVideo(filePath) {
  const stats = await fs.stat(filePath);
  const media = await inspectMedia(filePath);
  return {
    stats,
    media,
  };
}
