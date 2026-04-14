import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs/promises";
import {
  normalizeGameplayPreset,
  resolveGameplayPresetPath,
} from "../../sdk/gameplay/presets.js";

test("normalizeGameplayPreset resolves supported aliases", () => {
  assert.equal(normalizeGameplayPreset("subway"), "subway-surfers");
  assert.equal(normalizeGameplayPreset("minecraft"), "minecraft-parkour");
  assert.equal(normalizeGameplayPreset("gta"), "gta-parkour");
  assert.equal(normalizeGameplayPreset("not-a-preset"), null);
});

test("resolveGameplayPresetPath finds a preset-backed file", async () => {
  const projectRoot = path.resolve(process.cwd());
  const realGameplayDir = path.join(projectRoot, "assets", "gameplay", "real");
  const tempFile = path.join(realGameplayDir, "gta-parkour.mp4");

  await fs.mkdir(realGameplayDir, { recursive: true });
  await fs.writeFile(tempFile, "");

  try {
    const resolved = await resolveGameplayPresetPath("gta", {
      projectRoot,
    });
    assert.equal(resolved, tempFile);
  } finally {
    await fs.rm(tempFile, { force: true });
  }
});
