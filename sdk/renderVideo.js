import { buildFilterGraph } from "./ffmpeg/buildFilterGraph.js";
import { normalizeMediaToolPath } from "./ffmpeg/runtime.js";
import { runFfmpeg } from "./ffmpeg/runFfmpeg.js";

function createInputArgs(source, fps) {
  if (source.kind === "image") {
    return ["-loop", "1", "-framerate", `${fps}`, "-i", normalizeMediaToolPath(source.path)];
  }

  return ["-stream_loop", "-1", "-i", normalizeMediaToolPath(source.path)];
}

function buildVisualInputs(scenePlan) {
  switch (scenePlan.mode) {
    case "full-gameplay":
      return [{ role: "gameplay", source: scenePlan.sources.gameplay }];
    case "split-layout":
      return [
        { role: "gameplay", source: scenePlan.sources.gameplay },
        { role: "media", source: scenePlan.sources.media },
      ];
    case "full-media":
      return [{ role: "media", source: scenePlan.sources.media }];
    case "media-gameplay-inset":
      return [
        { role: "media", source: scenePlan.sources.media },
        { role: "gameplay", source: scenePlan.sources.gameplay },
      ];
    default:
      throw new Error(`Unsupported render mode: ${scenePlan.mode}`);
  }
}

export async function renderVideo(scenePlan) {
  const visualInputs = buildVisualInputs(scenePlan);
  const args = ["-y", "-hide_banner", "-loglevel", "error"];
  const inputMap = {};

  visualInputs.forEach(({ role, source }, index) => {
    inputMap[role] = index;
    args.push(...createInputArgs(source, scenePlan.renderOptions.fps));
  });

  const audioInputIndex = visualInputs.length;
  args.push("-i", normalizeMediaToolPath(scenePlan.audio.audioPath));

  const { filterComplex, outputLabel } = buildFilterGraph({
    layout: scenePlan.layout,
    duration: scenePlan.duration,
    fps: scenePlan.renderOptions.fps,
    subtitles: scenePlan.subtitles,
    inputMap,
  });

  args.push(
    "-filter_complex",
    filterComplex,
    "-map",
    `[${outputLabel}]`,
    "-map",
    `${audioInputIndex}:a:0`,
    "-t",
    `${scenePlan.duration}`,
    "-r",
    `${scenePlan.renderOptions.fps}`,
    "-c:v",
    scenePlan.renderOptions.videoCodec,
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    scenePlan.renderOptions.audioCodec,
    "-movflags",
    "+faststart",
    normalizeMediaToolPath(scenePlan.outputPaths.finalVideo),
  );

  await runFfmpeg(args);
  return {
    outputPath: scenePlan.outputPaths.finalVideo,
  };
}
