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
  "split layout render composes gameplay and media into a vertical MP4",
  { skip: !renderEnv.ok },
  async () => {
    await ensureIntegrationAssets();
    const outputDir = await prepareRenderOutputDir("split-layout");

    const result = await generateRedditVideo({
      inputFile: "./tests/fixtures/short-story.txt",
      outputDir,
      mode: "split-layout",
      voice: {
        provider: "mock",
      },
      gameplaySource: "./assets/gameplay/placeholder-endless-runner.mp4",
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
    assert.ok(Math.abs(output.media.duration - result.duration) < 1.2);
  },
);
