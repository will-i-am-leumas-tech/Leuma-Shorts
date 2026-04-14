import { generateSubtitlesFromText, renderSrtFromSubtitles } from "./captions/generateSubtitlesFromText.js";
import { renderAssFromSubtitles } from "./captions/renderAssFromSubtitles.js";
import { resolveLayout } from "./layouts/index.js";
import { prepareGameplayBackground } from "./media/prepareGameplayBackground.js";
import { prepareMediaSource } from "./media/prepareMediaSource.js";
import { validateAssets } from "./validateAssets.js";
import { buildOutputPaths } from "./utils/paths.js";

export async function buildScenePlan(options) {
  const outputPaths = buildOutputPaths(options.outputDir);
  const gameplay = options.gameplaySource
    ? await prepareGameplayBackground({
        source: options.gameplaySource,
        outputDir: outputPaths.outputDir,
      })
    : null;
  const media = options.mediaSource
    ? await prepareMediaSource({
        source: options.mediaSource,
        outputDir: outputPaths.outputDir,
      })
    : null;

  validateAssets({
    mode: options.mode,
    gameplay,
    media,
  });

  const layout = resolveLayout(options.mode, {
    width: options.renderOptions.width,
    height: options.renderOptions.height,
    gameplaySource: gameplay,
    mediaSource: media,
  });

  const subtitlesEnabled = options.subtitles?.enabled !== false;
  const subtitleItems = subtitlesEnabled
    ? generateSubtitlesFromText(options.inputText, options.voiceover.duration, {
        maxWordsPerChunk: options.subtitles.maxWordsPerChunk,
        maxCharsPerChunk: options.subtitles.maxCharsPerChunk,
      })
    : [];

  const subtitles = subtitlesEnabled
    ? {
        enabled: true,
        style: options.subtitles.style,
        items: subtitleItems,
        srtText: renderSrtFromSubtitles(subtitleItems),
        assText: renderAssFromSubtitles(subtitleItems, {
          style: options.subtitles.style,
          canvas: layout.canvas,
          captions: layout.regions.captions,
        }),
        srtPath: outputPaths.subtitlesSrt,
        assPath: outputPaths.subtitlesAss,
      }
    : {
        enabled: false,
        items: [],
        srtText: "",
        assText: "",
        srtPath: outputPaths.subtitlesSrt,
        assPath: outputPaths.subtitlesAss,
      };

  const timeline = [
    {
      id: "scene-1",
      start: 0,
      end: options.voiceover.duration,
      mode: layout.mode,
      regions: layout.regions,
      gameplayPath: gameplay?.path || null,
      mediaPath: media?.path || null,
      captionCount: subtitleItems.length,
    },
  ];

  const manifest = {
    mode: layout.mode,
    title: options.title || null,
    gameplayPreset: options.gameplayPreset || null,
    duration: options.voiceover.duration,
    inputFile: options.inputFile || null,
    textLength: options.inputText.length,
    voice: options.voice,
    renderOptions: options.renderOptions,
    sources: {
      gameplay: gameplay,
      media,
    },
    layout,
    subtitleCount: subtitleItems.length,
    createdAt: new Date().toISOString(),
  };

  return {
    mode: layout.mode,
    duration: options.voiceover.duration,
    inputText: options.inputText,
    title: options.title || null,
    outputPaths,
    renderOptions: options.renderOptions,
    voice: options.voice,
    audio: options.voiceover,
    sources: {
      gameplay,
      media,
    },
    layout,
    subtitles,
    timeline,
    manifest,
  };
}
