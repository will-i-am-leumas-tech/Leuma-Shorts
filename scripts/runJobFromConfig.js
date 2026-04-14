import path from "node:path";
import { generateRedditVideo } from "../sdk/index.js";
import { readJsonFile } from "../sdk/utils/fs.js";
import { ensureDemoAssets } from "../sdk/media/ensureDemoAssets.js";

export async function runJobFromConfig(configRelativePath) {
  const projectRoot = process.cwd();
  await ensureDemoAssets({ projectRoot });
  const job = await readJsonFile(path.resolve(projectRoot, configRelativePath));
  return generateRedditVideo(job);
}
