import test from "node:test";
import assert from "node:assert/strict";
import { resolveLayout } from "../../sdk/layouts/index.js";

test("resolveLayout returns a full-screen gameplay region", () => {
  const layout = resolveLayout("full-gameplay", {
    width: 1080,
    height: 1920,
  });

  assert.equal(layout.mode, "full-gameplay");
  assert.deepEqual(layout.regions.gameplay, {
    x: 0,
    y: 0,
    width: 1080,
    height: 1920,
  });
  assert.ok(layout.regions.captions.height > 0);
});

test("resolveLayout returns distinct gameplay, media, and caption regions for split mode", () => {
  const layout = resolveLayout("split-layout", {
    width: 1080,
    height: 1920,
  });

  assert.equal(layout.mode, "split-layout");
  assert.ok(layout.regions.media.height > 0);
  assert.ok(layout.regions.gameplay.height > 0);
  assert.ok(layout.regions.captions.height > 0);
  assert.equal(layout.regions.gameplay.y, layout.regions.media.height);
});
