import { normalizeGameplayPreset } from "./gameplay/presets.js";

const SUPPORTED_MODES = new Set([
  "full-gameplay",
  "split-layout",
  "full-media",
  "media-gameplay-inset",
  "auto",
]);

const SUPPORTED_PROVIDERS = new Set(["mock", "openai", "elevenlabs"]);

const DEFAULTS = {
  mode: "full-gameplay",
  voice: {
    provider: "mock",
    voice: "narrator",
    speed: 1,
    model: "gpt-4o-mini-tts",
  },
  subtitles: {
    enabled: true,
    style: "reddit-bold",
    maxWordsPerChunk: 8,
    maxCharsPerChunk: 52,
  },
  renderOptions: {
    width: 1080,
    height: 1920,
    fps: 30,
    videoCodec: "libx264",
    audioCodec: "aac",
  },
};

export function validateJobConfig(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Job config must be an object.");
  }

  const config = {
    ...input,
    mode: input.mode || DEFAULTS.mode,
    gameplayPreset: normalizeGameplayPreset(input.gameplayPreset),
    voice: {
      ...DEFAULTS.voice,
      ...(input.voice || {}),
    },
    subtitles: {
      ...DEFAULTS.subtitles,
      ...(input.subtitles || {}),
    },
    renderOptions: {
      ...DEFAULTS.renderOptions,
      ...(input.renderOptions || {}),
    },
  };

  if (!config.inputText && !config.inputFile) {
    throw new Error("Provide either inputText or inputFile.");
  }

  if (!config.outputDir) {
    throw new Error("outputDir is required.");
  }

  if (!SUPPORTED_MODES.has(config.mode)) {
    throw new Error(`Unsupported mode: ${config.mode}`);
  }

  if (!SUPPORTED_PROVIDERS.has(config.voice.provider)) {
    throw new Error(`Unsupported voice provider: ${config.voice.provider}`);
  }

  if (input.gameplayPreset && !config.gameplayPreset) {
    throw new Error(
      "Unsupported gameplayPreset. Use one of: subway-surfers, minecraft-parkour, gta-parkour.",
    );
  }

  if (config.mode === "full-gameplay" && !config.gameplaySource && !config.gameplayPreset) {
    throw new Error("gameplaySource or gameplayPreset is required for full-gameplay mode.");
  }

  if (
    config.mode === "split-layout" &&
    ((!config.gameplaySource && !config.gameplayPreset) || !config.mediaSource)
  ) {
    throw new Error("split-layout mode requires gameplaySource or gameplayPreset, plus mediaSource.");
  }

  if (config.mode === "full-media" && !config.mediaSource) {
    throw new Error("mediaSource is required for full-media mode.");
  }

  if (
    config.mode === "media-gameplay-inset" &&
    ((!config.gameplaySource && !config.gameplayPreset) || !config.mediaSource)
  ) {
    throw new Error(
      "media-gameplay-inset mode requires gameplaySource or gameplayPreset, plus mediaSource.",
    );
  }

  if (config.mode === "auto" && !config.gameplaySource && !config.gameplayPreset && !config.mediaSource) {
    throw new Error("auto mode requires at least one of gameplaySource, gameplayPreset, or mediaSource.");
  }

  if (config.renderOptions.width <= 0 || config.renderOptions.height <= 0) {
    throw new Error("renderOptions width and height must be positive.");
  }

  if (config.renderOptions.fps <= 0) {
    throw new Error("renderOptions fps must be positive.");
  }

  return config;
}
