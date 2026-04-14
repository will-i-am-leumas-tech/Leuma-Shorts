import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { generateRedditVideo } from "../../sdk/index.js";
import {
  ensureIntegrationAssets,
  inspectOutputVideo,
  prepareRenderOutputDir,
  renderEnv,
} from "./helpers.js";

test(
  "full gameplay render produces a vertical MP4 with audio",
  { skip: !renderEnv.ok },
  async () => {
    await ensureIntegrationAssets();
    const outputDir = await prepareRenderOutputDir("full-gameplay");

    const result = await generateRedditVideo({
      inputFile: "./tests/fixtures/short-story.txt",
      outputDir,
      mode: "full-gameplay",
      voice: {
        provider: "mock",
      },
      gameplaySource: "./assets/gameplay/placeholder-endless-runner.mp4",
      subtitles: {
        enabled: true,
        style: "reddit-bold",
      },
    });

    const output = await inspectOutputVideo(result.outputFile);

    assert.ok(output.stats.size > 0);
    assert.equal(output.media.width, 1080);
    assert.equal(output.media.height, 1920);
    assert.ok(output.media.hasAudio);
    assert.ok(Math.abs(output.media.duration - result.duration) < 1.2);
    assert.equal(path.basename(result.subtitleFile), "subtitles.srt");
  },
);
