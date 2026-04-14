import path from "node:path";
import fs from "node:fs/promises";
import { ensureDir, fileExists } from "../utils/fs.js";
import { sha1 } from "../utils/hash.js";

const CONTENT_TYPE_EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "video/mp4": ".mp4",
  "video/quicktime": ".mov",
};

export async function downloadMedia(url, outputPath) {
  if (outputPath && (await fileExists(outputPath))) {
    return outputPath;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download media from ${url}: ${response.status}`);
  }

  let finalPath = outputPath;
  if (!finalPath) {
    const contentType = response.headers.get("content-type")?.split(";")[0] || "";
    const extension =
      path.extname(new URL(url).pathname) || CONTENT_TYPE_EXTENSIONS[contentType] || ".bin";
    finalPath = path.join(process.cwd(), ".tmp", "downloads", `${sha1(url)}${extension}`);
  }

  await ensureDir(path.dirname(finalPath));
  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(finalPath, Buffer.from(arrayBuffer));
  return finalPath;
}
