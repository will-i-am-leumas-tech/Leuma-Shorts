import { escapeFilterPath } from "../utils/paths.js";
import { normalizeMediaToolPath } from "./runtime.js";

function coverFilter(inputLabel, region, outputLabel) {
  return `[${inputLabel}]scale=${region.width}:${region.height}:force_original_aspect_ratio=increase,crop=${region.width}:${region.height},setsar=1[${outputLabel}]`;
}

export function buildFilterGraph({ layout, duration, fps, subtitles, inputMap }) {
  const lines = [];
  const mode = layout.mode;
  const { canvas } = layout;

  if (mode === "full-gameplay") {
    lines.push(coverFilter(`${inputMap.gameplay}:v`, layout.regions.gameplay, "vbase"));
  } else if (mode === "full-media") {
    lines.push(coverFilter(`${inputMap.media}:v`, layout.regions.media, "vbase"));
  } else if (mode === "split-layout") {
    lines.push(coverFilter(`${inputMap.media}:v`, layout.regions.media, "mediafit"));
    lines.push(coverFilter(`${inputMap.gameplay}:v`, layout.regions.gameplay, "gamefit"));
    lines.push(`color=c=black:s=${canvas.width}x${canvas.height}:r=${fps}:d=${duration}[canvas0]`);
    lines.push(`[canvas0][mediafit]overlay=${layout.regions.media.x}:${layout.regions.media.y}[canvas1]`);
    lines.push(
      `[canvas1][gamefit]overlay=${layout.regions.gameplay.x}:${layout.regions.gameplay.y}[vbase]`,
    );
  } else if (mode === "media-gameplay-inset") {
    lines.push(coverFilter(`${inputMap.media}:v`, layout.regions.media, "mediafit"));
    lines.push(coverFilter(`${inputMap.gameplay}:v`, layout.regions.gameplay, "gamefit"));
    lines.push(`[mediafit][gamefit]overlay=${layout.regions.gameplay.x}:${layout.regions.gameplay.y}[vbase]`);
  } else {
    throw new Error(`Unsupported render mode: ${mode}`);
  }

  if (subtitles?.enabled && subtitles.assPath) {
    lines.push(
      `[vbase]ass='${escapeFilterPath(normalizeMediaToolPath(subtitles.assPath))}',format=yuv420p[vout]`,
    );
  } else {
    lines.push("[vbase]format=yuv420p[vout]");
  }

  return {
    filterComplex: lines.join(";"),
    outputLabel: "vout",
  };
}
