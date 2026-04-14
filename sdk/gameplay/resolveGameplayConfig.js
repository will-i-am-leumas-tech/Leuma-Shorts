import { normalizeGameplayPreset, resolveGameplayPresetPath } from "./presets.js";

export async function resolveGameplayConfig(config, { projectRoot = process.cwd() } = {}) {
  const gameplayPreset = normalizeGameplayPreset(config.gameplayPreset);
  if (!gameplayPreset) {
    return config;
  }

  if (config.gameplaySource) {
    return {
      ...config,
      gameplayPreset,
    };
  }

  const gameplaySource = await resolveGameplayPresetPath(gameplayPreset, {
    projectRoot,
    requireExists: true,
  });

  return {
    ...config,
    gameplayPreset,
    gameplaySource,
  };
}
