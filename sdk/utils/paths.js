import path from "node:path";

export function resolveProjectPath(projectRoot, targetPath) {
  return path.resolve(projectRoot || process.cwd(), targetPath);
}

export function isRemoteSource(value) {
  return /^https?:\/\//i.test(String(value || ""));
}

export function buildOutputPaths(outputDir) {
  const absoluteOutputDir = path.resolve(process.cwd(), outputDir);
  return {
    outputDir: absoluteOutputDir,
    finalVideo: path.join(absoluteOutputDir, "final.mp4"),
    voiceoverWav: path.join(absoluteOutputDir, "voiceover.wav"),
    voiceoverMp3: path.join(absoluteOutputDir, "voiceover.mp3"),
    subtitlesSrt: path.join(absoluteOutputDir, "subtitles.srt"),
    subtitlesAss: path.join(absoluteOutputDir, "subtitles.ass"),
    timeline: path.join(absoluteOutputDir, "timeline.json"),
    manifest: path.join(absoluteOutputDir, "manifest.json"),
    cacheDir: path.join(absoluteOutputDir, ".cache"),
  };
}

export function escapeFilterPath(filePath) {
  return filePath
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/,/g, "\\,")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/'/g, "\\'");
}
