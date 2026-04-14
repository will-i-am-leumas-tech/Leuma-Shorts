import test from "node:test";
import assert from "node:assert/strict";
import { generateRedditVideo } from "../../sdk/index.js";
import {
  ensureIntegrationAssets,
  inspectOutputVideo,
  prepareRenderOutputDir,
  renderEnv,
} from "./helpers.js";

test(
  "auto mode selects a valid composition and renders an image-backed short",
  { skip: !renderEnv.ok },
  async () => {
    await ensureIntegrationAssets();
    const outputDir = await prepareRenderOutputDir("auto-mode");

    const result = await generateRedditVideo({
      inputFile: "./tests/fixtures/short-story.txt",
      outputDir,
      mode: "auto",
      voice: {
        provider: "mock",
      },
      gameplaySource: "./assets/gameplay/placeholder-block-parkour.mp4",
      mediaSource: "./assets/media/sample-image.jpg",
      subtitles: {
        enabled: true,
      },
    });

    const output = await inspectOutputVideo(result.outputFile);

    assert.ok(output.stats.size > 0);
    assert.equal(output.media.width, 1080);
    assert.equal(output.media.height, 1920);
    assert.ok(output.media.hasAudio);
    assert.ok(Math.abs(output.media.duration - result.duration) < 1.2);
  },
);
