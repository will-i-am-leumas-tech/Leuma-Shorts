import test from "node:test";
import assert from "node:assert/strict";
import { validateJobConfig } from "../../sdk/validateJobConfig.js";

test("validateJobConfig throws on missing input and outputDir", () => {
  assert.throws(() => validateJobConfig({}), /inputText or inputFile/);
  assert.throws(
    () =>
      validateJobConfig({
        inputText: "hello",
      }),
    /outputDir is required/,
  );
});

test("validateJobConfig throws on unsupported mode", () => {
  assert.throws(
    () =>
      validateJobConfig({
        inputText: "hello",
        outputDir: "./output/test",
        mode: "diagonal-chaos",
      }),
    /Unsupported mode/,
  );
});

test("validateJobConfig applies defaults", () => {
  const config = validateJobConfig({
    inputText: "hello world",
    outputDir: "./output/test",
    gameplaySource: "./assets/gameplay/placeholder-endless-runner.mp4",
  });

  assert.equal(config.mode, "full-gameplay");
  assert.equal(config.voice.provider, "mock");
  assert.equal(config.renderOptions.width, 1080);
});

test("validateJobConfig accepts a supported gameplay preset", () => {
  const config = validateJobConfig({
    inputText: "hello world",
    outputDir: "./output/test-preset",
    gameplayPreset: "minecraft",
  });

  assert.equal(config.gameplayPreset, "minecraft-parkour");
});
