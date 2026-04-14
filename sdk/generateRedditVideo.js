import path from "node:path";
import { buildScenePlan } from "./buildScenePlan.js";
import { generateVoiceover } from "./generateVoiceover.js";
import { resolveGameplayConfig } from "./gameplay/resolveGameplayConfig.js";
import { validateEnvironment } from "./validateEnvironment.js";
import { validateJobConfig } from "./validateJobConfig.js";
import { renderVideo } from "./renderVideo.js";
import { ensureDir, readTextFile, writeJsonFile, writeTextFile } from "./utils/fs.js";
import { normalizeWhitespace } from "./utils/timing.js";

export async function generateRedditVideo(input) {
  const validatedConfig = validateJobConfig(input);
  const config = await resolveGameplayConfig(validatedConfig);

  await validateEnvironment({
    requireFfmpeg: true,
    requireFfprobe: true,
    voiceProvider: config.voice.provider,
  });

  const outputDir = path.resolve(process.cwd(), config.outputDir);
  await ensureDir(outputDir);

  const inputText = normalizeWhitespace(
    config.inputText || (await readTextFile(path.resolve(process.cwd(), config.inputFile))),
  );

  const voiceover = await generateVoiceover({
    inputText,
    outputDir,
    voice: config.voice,
  });

  const scenePlan = await buildScenePlan({
    ...config,
    inputText,
    voiceover,
  });

  if (scenePlan.subtitles.enabled) {
    await writeTextFile(scenePlan.subtitles.srtPath, scenePlan.subtitles.srtText);
    await writeTextFile(scenePlan.subtitles.assPath, scenePlan.subtitles.assText);
  }

  await writeJsonFile(scenePlan.outputPaths.timeline, scenePlan.timeline);
  await writeJsonFile(scenePlan.outputPaths.manifest, scenePlan.manifest);

  const renderResult = await renderVideo(scenePlan);

  return {
    outputDir: scenePlan.outputPaths.outputDir,
    outputFile: renderResult.outputPath,
    audioFile: scenePlan.audio.audioPath,
    subtitleFile: scenePlan.subtitles.enabled ? scenePlan.subtitles.srtPath : null,
    timelineFile: scenePlan.outputPaths.timeline,
    manifestFile: scenePlan.outputPaths.manifest,
    duration: scenePlan.duration,
    mode: scenePlan.mode,
  };
}
