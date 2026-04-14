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
  "full media render works with a clip source",
  { skip: !renderEnv.ok },
  async () => {
    await ensureIntegrationAssets();
    const outputDir = await prepareRenderOutputDir("full-media");

    const result = await generateRedditVideo({
      inputFile: "./tests/fixtures/short-story.txt",
      outputDir,
      mode: "full-media",
      voice: {
        provider: "mock",
      },
      mediaSource: "./assets/media/sample-clip.mp4",
      subtitles: {
        enabled: true,
      },
    });

    const output = await inspectOutputVideo(result.outputFile);

    assert.ok(output.stats.size > 0);
    assert.equal(output.media.width, 1080);
    assert.equal(output.media.height, 1920);
    assert.ok(output.media.hasAudio);
  },
);
