import path from "node:path";
import { downloadMedia } from "./downloadMedia.js";
import { inspectMedia } from "./inspectMedia.js";
import { fileExists } from "../utils/fs.js";
import { isRemoteSource } from "../utils/paths.js";
import { sha1 } from "../utils/hash.js";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export function detectMediaKind(filePath) {
  return IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase()) ? "image" : "video";
}

export async function prepareMediaSource({
  source,
  outputDir,
  label = "media",
}) {
  if (!source) {
    return null;
  }

  let resolvedPath;
  let downloaded = false;

  if (isRemoteSource(source)) {
    const extension = path.extname(new URL(source).pathname) || ".bin";
    resolvedPath = path.join(outputDir, ".cache", `${label}-${sha1(source)}${extension}`);
    resolvedPath = await downloadMedia(source, resolvedPath);
    downloaded = true;
  } else {
    resolvedPath = path.resolve(process.cwd(), source);
  }

  if (!(await fileExists(resolvedPath))) {
    throw new Error(`Media source not found: ${resolvedPath}`);
  }

  const kind = detectMediaKind(resolvedPath);
  let metadata = null;
  if (kind === "video") {
    metadata = await inspectMedia(resolvedPath);
  } else {
    try {
      metadata = await inspectMedia(resolvedPath);
    } catch {
      metadata = {
        path: resolvedPath,
        duration: 0,
        width: null,
        height: null,
        hasVideo: true,
        hasAudio: false,
        formatName: "image2",
      };
    }
  }

  return {
    source,
    path: resolvedPath,
    kind,
    downloaded,
    metadata,
  };
}
