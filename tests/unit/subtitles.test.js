import test from "node:test";
import assert from "node:assert/strict";
import {
  generateSubtitlesFromText,
} from "../../sdk/captions/generateSubtitlesFromText.js";

test("generateSubtitlesFromText covers the full narration duration in order", () => {
  const subtitles = generateSubtitlesFromText(
    "One short caption line. Another short caption line. Final caption line.",
    9,
    {
      maxWordsPerChunk: 4,
      maxCharsPerChunk: 28,
    },
  );

  assert.ok(subtitles.length >= 2);
  assert.equal(subtitles[0].start, 0);
  assert.equal(subtitles.at(-1).end, 9);
  assert.ok(
    subtitles.every((subtitle, index) => index === 0 || subtitle.start >= subtitles[index - 1].end),
  );
});
