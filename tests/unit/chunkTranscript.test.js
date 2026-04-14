import test from "node:test";
import assert from "node:assert/strict";
import { chunkTranscript } from "../../sdk/captions/chunkTranscript.js";

test("chunkTranscript returns readable mobile-friendly chunks", () => {
  const chunks = chunkTranscript(
    "This is a short paragraph. It should become multiple readable chunks for captions on mobile video.",
    {
      maxWords: 5,
      maxChars: 30,
    },
  );

  assert.ok(chunks.length >= 2);
  assert.ok(chunks.every((chunk) => chunk.split(" ").length <= 5));
  assert.ok(chunks.every((chunk) => chunk.length <= 30));
});
