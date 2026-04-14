import path from "node:path";
import { runFfprobe } from "../ffmpeg/runFfprobe.js";

export async function inspectMedia(targetPath) {
  const inspection = await runFfprobe(targetPath);
  const videoStream = inspection.streams?.find((stream) => stream.codec_type === "video");
  const audioStream = inspection.streams?.find((stream) => stream.codec_type === "audio");
  const duration =
    Number(videoStream?.duration) ||
    Number(audioStream?.duration) ||
    Number(inspection.format?.duration) ||
    0;

  return {
    path: path.resolve(targetPath),
    duration,
    width: videoStream?.width || null,
    height: videoStream?.height || null,
    hasVideo: Boolean(videoStream),
    hasAudio: Boolean(audioStream),
    formatName: inspection.format?.format_name || "",
  };
}
