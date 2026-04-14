import fs from "node:fs/promises";
import path from "node:path";

export const GAMEPLAY_PRESETS = Object.freeze({
  "subway-surfers": {
    id: "subway-surfers",
    label: "Subway Surfers",
  },
  "minecraft-parkour": {
    id: "minecraft-parkour",
    label: "Minecraft Parkour",
  },
  "gta-parkour": {
    id: "gta-parkour",
    label: "GTA Parkour",
  },
});

const GAMEPLAY_PRESET_ALIASES = new Map([
  ["subway", "subway-surfers"],
  ["subwaysurfers", "subway-surfers"],
  ["subway-surfers", "subway-surfers"],
  ["minecraft", "minecraft-parkour"],
  ["minecraftparkour", "minecraft-parkour"],
  ["minecraft-parkour", "minecraft-parkour"],
  ["gta", "gta-parkour"],
  ["gta-parkour", "gta-parkour"],
  ["gtaparkour", "gta-parkour"],
]);

const GAMEPLAY_EXTENSIONS = [".mp4", ".mov", ".mkv", ".webm"];

export function normalizeGameplayPreset(value) {
  if (!value) {
    return null;
  }

  const normalized = String(value).trim().toLowerCase();
  return GAMEPLAY_PRESET_ALIASES.get(normalized) || null;
}

export function isSupportedGameplayPreset(value) {
  return Boolean(normalizeGameplayPreset(value));
}

export function listGameplayPresets() {
  return Object.values(GAMEPLAY_PRESETS);
}

export async function resolveGameplayPresetPath(
  preset,
  { projectRoot = process.cwd(), requireExists = true } = {},
) {
  const normalizedPreset = normalizeGameplayPreset(preset);
  if (!normalizedPreset) {
    throw new Error(
      `Unsupported gameplay preset: ${preset}. Supported presets: ${Object.keys(GAMEPLAY_PRESETS).join(", ")}`,
    );
  }

  const realGameplayDir = path.resolve(projectRoot, "assets", "gameplay", "real");
  for (const extension of GAMEPLAY_EXTENSIONS) {
    const candidate = path.join(realGameplayDir, `${normalizedPreset}${extension}`);
    try {
      const stats = await fs.stat(candidate);
      if (stats.isFile()) {
        return candidate;
      }
    } catch {
      // Continue searching alternative extensions.
    }
  }

  if (!requireExists) {
    return path.join(realGameplayDir, `${normalizedPreset}.mp4`);
  }

  throw new Error(
    `Gameplay preset '${normalizedPreset}' is not installed. Import a real clip into assets/gameplay/real/${normalizedPreset}.[mp4|mov|mkv|webm] first.`,
  );
}
